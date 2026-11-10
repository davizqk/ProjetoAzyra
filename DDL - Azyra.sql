CREATE DATABASE Azyra;
GO

USE Azyra;
GO

CREATE TABLE Ensino
(
    IdModelo INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(30) NOT NULL,
    Descricao VARCHAR(200)
);
GO

CREATE TABLE Turno
(
    IdPeriodo INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(30) NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL
);
GO

CREATE TABLE Classe
(
    IdTurma INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(80) NOT NULL,
    AnoLetivo INT NOT NULL,
    IdModelo INT FOREIGN KEY REFERENCES ModeloEnsino(IdModelo),
    IdPeriodo INT FOREIGN KEY REFERENCES Periodo(IdPeriodo)
);
GO

CREATE TABLE Educador 
(
    IdProfessor INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(120) NOT NULL,
    Cpf VARCHAR(11) NOT NULL UNIQUE,
    Email VARCHAR (150) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL
);
GO

CREATE TABLE Estudante
(
    IdAluno INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(120) NOT NULL,
    Cpf VARCHAR(11) NOT NULL UNIQUE,
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE HorarioTurma
(
    IdHorario INT PRIMARY KEY IDENTITY(1,1),
    DiaSemana INT NOT NULL,
    HoraEntrada TIME NOT NULL,
    ToleranciaMin INT NOT NULL DEFAULT 0,
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE HistoricoAtraso
(
    IdHistorico           INT PRIMARY KEY IDENTITY(1,1),
    IdAluno               INT        NOT NULL,
    DataAtraso            DATETIME   NOT NULL,
    MinutosAtraso         INT        NOT NULL,
    Justificativa         VARCHAR    (255),
    FOREIGN KEY (IdAluno) REFERENCES Aluno(IdAluno)
);
GO

CREATE TABLE QRCode
(
    IdQR INT PRIMARY KEY IDENTITY(1,1),
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma),
    TokenHash VARCHAR(255) NOT NULL UNIQUE,
    GeradoEm DATETIME NOT NULL DEFAULT GETDATE(),
    ExpiraEm DATETIME NOT NULL,
    Ativo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE PerfilAcesso
(
    IdPerfil INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(40) NOT NULL,
    Permissoes VARCHAR(500)
);
GO

CREATE TABLE RegistroChegada
(
    IdRegistro INT PRIMARY KEY IDENTITY(1,1),
    IdAluno INT FOREIGN KEY REFERENCES Aluno(IdAluno),
    DataChegada DATE NOT NULL,
    HoraChegada TIME NOT NULL,
    Atrasado BIT NOT NULL
);
GO

SELECT * FROM Ensino;
SELECT * FROM Turno;
SELECT * FROM Classe;
SELECT * FROM Estudante;
SELECT * FROM HorarioTurma;
SELECT * FROM HistoricoAtraso;
SELECT * FROM QRCode;
SELECT * FROM PerfilAcesso;
SELECT * FROM Educador;
SELECT * FROM RegistroChegada;