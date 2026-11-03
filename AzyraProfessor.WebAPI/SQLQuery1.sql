
SELECT
    COLUMNPROPERTY(
        OBJECT_ID('dbo.Professor'),
        'IdProfessor',
        'IsIdentity'
    ) AS IdAutomatico;

SELECT IdProfessor, Nome, Cpf
FROM dbo.Professor;

SELECT DB_NAME() AS BancoAtual;

SELECT COUNT(*) AS TotalProfessores
FROM dbo.Professor;
