CREATE DATABASE Azyra;
GO

USE Azyra;
GO

CREATE TABLE ModeloEnsino (
    IdModelo       INT PRIMARY KEY IDENTITY(1,1),
    Nome           VARCHAR(30) NOT NULL,
    Descricao      VARCHAR(200)
);
GO

CREATE TABLE Periodo (
    IdPeriodo      INT PRIMARY KEY IDENTITY(1,1),
    Nome           VARCHAR(30) NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL
);
GO

CREATE TABLE Turma (
    IdTurma INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(80) NOT NULL,
    AnoLetivo INT NOT NULL,
    IdModelo INT FOREIGN KEY REFERENCES ModeloEnsino(IdModelo),
    IdPeriodo INT FOREIGN KEY REFERENCES Periodo(IdPeriodo)
);
GO

CREATE TABLE Aluno (
    IdAluno INT PRIMARY KEY IDENTITY(1,1),
    CPF CHAR(11) NOT NULL UNIQUE,
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE HorarioTurma (
    IdHorario INT PRIMARY KEY IDENTITY(1,1),
    DiaSemana INT NOT NULL,
    HoraEntrada TIME NOT NULL,
    ToleranciaMin INT NOT NULL,
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE HistoricoAtraso (
    IdHistorico INT PRIMARY KEY IDENTITY(1,1),
    Data DATE NOT NULL,
    Atrasado BIT NOT NULL,
    ConsecutivoAtual INT NOT NULL DEFAULT 0
);
GO

CREATE TABLE AlertaRecorrencia (
    IdAlerta INT PRIMARY KEY IDENTITY(1,1),
    IdAluno INT FOREIGN KEY REFERENCES Aluno(IdAluno),
    GeradoEm DATETIME NOT NULL DEFAULT GETDATE(),
    QuantidadeDetectada INT NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pendente'
);
GO

CREATE TABLE QRCode (
    IdQR INT PRIMARY KEY IDENTITY(1,1),
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma),
    TokenHash VARCHAR(255) NOT NULL UNIQUE,
    GeradoEm DATETIME NOT NULL DEFAULT GETDATE(),
    ExpiraEm DATETIME NOT NULL,
    Ativo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE PerfilAcesso (
    IdPerfil INT PRIMARY KEY IDENTITY(1,1),
    Nome VARCHAR(40) NOT NULL,
    Permissoes VARCHAR(500)
);
GO

SELECT * FROM ModeloEnsino;
SELECT * FROM Periodo;
SELECT * FROM Turma;
SELECT * FROM Aluno;
SELECT * FROM HorarioTurma;
SELECT * FROM HistoricoAtraso;
SELECT * FROM QRCode;
SELECT * FROM PerfilAcesso;
GO
