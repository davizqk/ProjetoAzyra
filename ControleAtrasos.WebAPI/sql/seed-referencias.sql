-- Execute no banco ControleAtrasos existente, apenas para incluir dados de referencia ausentes.
-- NAO apaga nem recria tabelas, alunos, usuarios, matriculas ou registros.
USE ControleAtrasos;
GO
SET XACT_ABORT ON;
BEGIN TRANSACTION;

INSERT INTO dbo.Papeis (Nome)
SELECT v.Nome FROM (VALUES ('PROFESSOR'), ('AQV'), ('COORDENACAO'), ('ADMIN')) v(Nome)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Papeis p WHERE p.Nome = v.Nome);

INSERT INTO dbo.ModelosEnsino (Nome)
SELECT v.Nome FROM (VALUES ('Comunidade'), ('SEDUC')) v(Nome)
WHERE NOT EXISTS (SELECT 1 FROM dbo.ModelosEnsino m WHERE m.Nome = v.Nome);

INSERT INTO dbo.Periodos (Nome)
SELECT v.Nome FROM (VALUES ('Manha'), ('Tarde'), ('Noite'), ('Integral')) v(Nome)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Periodos p WHERE p.Nome = v.Nome);

INSERT INTO dbo.RegrasRecorrencia (IdModelo, TipoContagem, QuantidadeConsecutiva, ConsiderarDiasLetivos, Ativa)
SELECT m.IdModelo, 'DIAS_LETIVOS_CONSECUTIVOS',
       CASE WHEN m.Nome = 'Comunidade' THEN 3 ELSE 2 END, 1, 1
FROM dbo.ModelosEnsino m
WHERE m.Nome IN ('Comunidade', 'SEDUC')
AND NOT EXISTS (
    SELECT 1 FROM dbo.RegrasRecorrencia r
    WHERE r.IdModelo = m.IdModelo AND r.TipoContagem = 'DIAS_LETIVOS_CONSECUTIVOS'
);
COMMIT TRANSACTION;

SELECT IdPapel, Nome FROM dbo.Papeis;
SELECT IdPeriodo, Nome FROM dbo.Periodos;
SELECT IdModelo, Nome FROM dbo.ModelosEnsino;
