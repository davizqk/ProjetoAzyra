-- EXEMPLO: preenchimento inicial do calendario geral, sem sobrepor datas existentes.
-- Revise feriados, recessos e sabados letivos conforme o calendario oficial.
-- Todos os dias de segunda a sexta sao considerados inicialmente letivos.
USE ControleAtrasos;
GO
DECLARE @Inicio date = '2026-11-01';
DECLARE @Fim date = '2026-12-18';
IF @Fim < @Inicio OR DATEDIFF(day, @Inicio, @Fim) > 366
    THROW 50001, 'Intervalo invalido; maximo de 366 dias.', 1;
;WITH Datas AS (
    SELECT @Inicio AS DataLetiva
    UNION ALL SELECT DATEADD(day, 1, DataLetiva)
    FROM Datas WHERE DataLetiva < @Fim
)
INSERT INTO dbo.CalendarioLetivo (DataLetiva, DiaLetivo, Descricao)
SELECT d.DataLetiva,
       CASE WHEN ((DATEDIFF(day, CONVERT(date, '19000101'), d.DataLetiva) % 7 + 7) % 7) BETWEEN 0 AND 4 THEN 1 ELSE 0 END,
       'Calendario inicial - revisar feriados e recessos'
FROM Datas d
WHERE NOT EXISTS (SELECT 1 FROM dbo.CalendarioLetivo c WHERE c.DataLetiva = d.DataLetiva)
OPTION (MAXRECURSION 0);
SELECT DataLetiva, DiaLetivo, Descricao FROM dbo.CalendarioLetivo
WHERE DataLetiva BETWEEN @Inicio AND @Fim ORDER BY DataLetiva;
