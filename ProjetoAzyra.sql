
CREATE DATABASE AzyraProfessor;
GO

USE AzyraProfessor;
GO

CREATE TABLE Professor
(
    IdProfessor     INT PRIMARY KEY IDENTITY     (1,1),
    Nome            VARCHAR    (120)     NOT NULL,
    Email           VARCHAR    (150)     NOT NULL UNIQUE,
    Senha           VARCHAR    (255)     NOT NULL
);
GO

CREATE TABLE Aluno
(
    IdAluno        INT PRIMARY KEY IDENTITY    (1,1),
    Nome           VARCHAR       (120)         NOT NULL,
    Matricula      VARCHAR       (30)          NOT NULL UNIQUE,
    Turma          VARCHAR       (50)          NOT NULL
);
GO

CREATE TABLE HistoricoAtraso
(
    IdHistorico   INT PRIMARY KEY IDENTITY(1,1),
    IdAluno       INT        NOT NULL,
    DataAtraso    DATETIME   NOT NULL,
    MinutosAtraso INT        NOT NULL,
    Justificativa VARCHAR    (255),
    FOREIGN KEY (IdAluno) REFERENCES Aluno(IdAluno)
);
GO

SELECT * FROM Professor;
SELECT * FROM Aluno;    
SELECT * FROM HistoricoAtraso;
GO
