-- Atualizacao ADITIVA do banco existente: preserva alunos, matriculas e registros.
-- Execute uma vez no SSMS, conectado ao mesmo servidor/banco usado pela API.
USE ControleAtrasos;
GO
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.ExcecoesCalendarioTurma', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ExcecoesCalendarioTurma
    (
        IdTurma int NOT NULL,
        DataLetiva date NOT NULL,
        TemAula bit NOT NULL,
        Motivo nvarchar(255) NULL,
        CONSTRAINT PK_ExcecoesCalendarioTurma PRIMARY KEY (IdTurma, DataLetiva),
        CONSTRAINT FK_ExcecoesCalendarioTurma_Turmas FOREIGN KEY (IdTurma)
            REFERENCES dbo.Turmas(IdTurma)
    );
END;
COMMIT TRANSACTION;
GO
SELECT TOP 10 * FROM dbo.ExcecoesCalendarioTurma;
