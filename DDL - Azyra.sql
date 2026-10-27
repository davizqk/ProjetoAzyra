CREATE DATABASE Azyra;
GO

USE Azyra;
GO

CREATE TABLE ModeloEnsino (
    IdModelo INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(30) NOT NULL,
    Descricao VARCHAR(200) NULL
);
GO

CREATE TABLE Periodo (
    IdPeriodo INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(30) NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL,
    CONSTRAINT CK_Periodo_Horarios CHECK (HoraFim > HoraInicio)
);
GO

CREATE TABLE Turma (
    IdTurma INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(80) NOT NULL,
    AnoLetivo INT NOT NULL,
    IdModelo INT NOT NULL,
    IdPeriodo INT NOT NULL,
    CONSTRAINT FK_Turma_ModeloEnsino
        FOREIGN KEY (IdModelo) REFERENCES ModeloEnsino(IdModelo),
    CONSTRAINT FK_Turma_Periodo
        FOREIGN KEY (IdPeriodo) REFERENCES Periodo(IdPeriodo)
);
GO

CREATE TABLE Aluno (
    IdAluno INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(120) NOT NULL,
    Matricula VARCHAR(30) NOT NULL UNIQUE,
    IdTurma INT NOT NULL,
    CONSTRAINT FK_Aluno_Turma
        FOREIGN KEY (IdTurma) REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE HorarioTurma (
    IdHorario INT IDENTITY(1,1) PRIMARY KEY,
    DiaSemana INT NOT NULL,
    HoraEntrada TIME NOT NULL,
    ToleranciaMin INT NOT NULL DEFAULT 0,
    IdTurma INT NOT NULL,
    CONSTRAINT CK_HorarioTurma_DiaSemana CHECK (DiaSemana BETWEEN 1 AND 7),
    CONSTRAINT CK_HorarioTurma_Tolerancia CHECK (ToleranciaMin >= 0),
    CONSTRAINT FK_HorarioTurma_Turma
        FOREIGN KEY (IdTurma) REFERENCES Turma(IdTurma),
    CONSTRAINT UQ_HorarioTurma_Turma_Dia UNIQUE (IdTurma, DiaSemana)
);
GO

CREATE TABLE HistoricoAtraso (
    IdHistorico INT IDENTITY(1,1) PRIMARY KEY,
    IdAluno INT NOT NULL,
    Data DATE NOT NULL,
    Atrasado BIT NOT NULL,
    ConsecutivoAtual INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_HistoricoAtraso_Aluno
        FOREIGN KEY (IdAluno) REFERENCES Aluno(IdAluno),
    CONSTRAINT CK_HistoricoAtraso_Consecutivo CHECK (ConsecutivoAtual >= 0),
    CONSTRAINT UQ_HistoricoAtraso_Aluno_Data UNIQUE (IdAluno, Data)
);
GO

CREATE TABLE AlertaRecorrencia (
    IdAlerta INT IDENTITY(1,1) PRIMARY KEY,
    IdAluno INT NOT NULL,
    GeradoEm DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    QuantidadeDetectada INT NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    CONSTRAINT FK_AlertaRecorrencia_Aluno
        FOREIGN KEY (IdAluno) REFERENCES Aluno(IdAluno),
    CONSTRAINT CK_AlertaRecorrencia_Quantidade CHECK (QuantidadeDetectada >= 0),
    CONSTRAINT CK_AlertaRecorrencia_Status
        CHECK (Status IN ('Pendente', 'Em acompanhamento', 'Resolvido'))
);
GO

CREATE TABLE QRCode (
    IdQR INT IDENTITY(1,1) PRIMARY KEY,
    IdTurma INT NOT NULL,
    TokenHash VARCHAR(255) NOT NULL UNIQUE,
    GeradoEm DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ExpiraEm DATETIME2 NOT NULL,
    Ativo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_QRCode_Turma
        FOREIGN KEY (IdTurma) REFERENCES Turma(IdTurma),
    CONSTRAINT CK_QRCode_Expiracao CHECK (ExpiraEm > GeradoEm)
);
GO

CREATE TABLE PerfilAcesso (
    IdPerfil INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(40) NOT NULL,
    Permissoes VARCHAR(500) NULL
);
GO

-- Consultas para conferir as tabelas
SELECT * FROM ModeloEnsino;
SELECT * FROM Periodo;
SELECT * FROM Turma;
SELECT * FROM Aluno;
SELECT * FROM HorarioTurma;
SELECT * FROM HistoricoAtraso;
SELECT * FROM AlertaRecorrencia;
SELECT * FROM QRCode;
SELECT * FROM PerfilAcesso;
GO
