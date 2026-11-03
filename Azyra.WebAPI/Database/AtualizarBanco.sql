/*
  Atualização do banco Azyra para a versão sem Matricula.
  FAÇA BACKUP antes de executar. Execute no banco Azyra.
  A remoção de Matricula é destrutiva: confirme que nenhum outro sistema depende dela.
*/
USE Azyra;
GO
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;

    IF COL_LENGTH('dbo.Aluno', 'CPF') IS NULL
        ALTER TABLE dbo.Aluno ADD CPF varchar(11) NULL;

    -- Se a coluna já existe com tamanho 14, reduz somente se todos os valores couberem.
    IF EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('dbo.Aluno') AND name = 'CPF'
          AND max_length > 11
    )
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.Aluno WHERE CPF IS NOT NULL AND LEN(REPLACE(REPLACE(CPF,'.',''),'-','')) > 11)
            THROW 51001, 'Existem CPFs com mais de 11 caracteres; revise os dados antes de reduzir a coluna.', 1;
        ALTER TABLE dbo.Aluno ALTER COLUMN CPF varchar(11) NULL;
    END;

    -- Remove índice/constraint associado à antiga Matricula antes de remover a coluna.
    DECLARE @sql nvarchar(max) = N'';
    SELECT @sql = @sql + N'ALTER TABLE dbo.Aluno DROP CONSTRAINT ' + QUOTENAME(dc.name) + N';'
    FROM sys.default_constraints dc
    JOIN sys.columns c ON c.object_id = dc.parent_object_id AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.Aluno') AND c.name = 'Matricula';
    IF @sql <> N'' EXEC sp_executesql @sql;

    SET @sql = N'';
    SELECT @sql = @sql + N'DROP INDEX ' + QUOTENAME(i.name) + N' ON dbo.Aluno;'
    FROM sys.indexes i
    WHERE i.object_id = OBJECT_ID('dbo.Aluno')
      AND i.is_primary_key = 0 AND i.is_unique_constraint = 0
      AND EXISTS (
          SELECT 1 FROM sys.index_columns ic
          JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
          WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND c.name = 'Matricula'
      );
    IF @sql <> N'' EXEC sp_executesql @sql;

    SET @sql = N'';
    SELECT @sql = @sql + N'ALTER TABLE dbo.Aluno DROP CONSTRAINT ' + QUOTENAME(k.name) + N';'
    FROM sys.key_constraints k
    WHERE k.parent_object_id = OBJECT_ID('dbo.Aluno')
      AND k.type = 'UQ'
      AND EXISTS (
          SELECT 1 FROM sys.index_columns ic
          JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
          WHERE ic.object_id = k.parent_object_id AND ic.index_id = k.unique_index_id AND c.name = 'Matricula'
      );
    IF @sql <> N'' EXEC sp_executesql @sql;

    IF COL_LENGTH('dbo.Aluno', 'Matricula') IS NOT NULL
        ALTER TABLE dbo.Aluno DROP COLUMN Matricula;

    IF COL_LENGTH('dbo.HistoricoAtraso', 'HoraChegada') IS NULL
    BEGIN
        ALTER TABLE dbo.HistoricoAtraso ADD HoraChegada time NULL;
        UPDATE dbo.HistoricoAtraso SET HoraChegada = CONVERT(time, Data);
        ALTER TABLE dbo.HistoricoAtraso ALTER COLUMN HoraChegada time NOT NULL;
    END;

    ALTER TABLE dbo.HistoricoAtraso ALTER COLUMN Data datetime2 NOT NULL;

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE name IN ('IX_Aluno_CPF', 'UX_Aluno_CPF')
          AND object_id = OBJECT_ID('dbo.Aluno')
    )
        CREATE UNIQUE INDEX IX_Aluno_CPF ON dbo.Aluno(CPF) WHERE CPF IS NOT NULL;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
