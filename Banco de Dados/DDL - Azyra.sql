
-- =====================================================
-- PROJETO: CONTROLE DE ATRASOS - UNIDADE 1.34
-- BANCO: SQL SERVER
-- =====================================================

CREATE DATABASE ControleAtrasos;
GO

USE ControleAtrasos;
GO


-- =====================================================
-- 1. PAPEIS
-- Define os tipos de acesso ao sistema
-- =====================================================

CREATE TABLE Papeis (
    IdPapel INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(30) NOT NULL UNIQUE
);
GO

INSERT INTO Papeis (Nome)
VALUES
('PROFESSOR'),
('AQV'),
('COORDENACAO'),
('ADMIN');
GO


-- =====================================================
-- 2. USUARIOS
-- Login dos professores, AQV, coordenacao e admin
-- Alunos NAO possuem login
-- =====================================================

CREATE TABLE Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,

    SenhaHash NVARCHAR(255) NOT NULL,

    Ativo BIT NOT NULL DEFAULT 1,

    DataCriacao DATETIME2 NOT NULL
        DEFAULT SYSDATETIME()
);
GO


-- =====================================================
-- 3. USUARIO_PAPEIS
-- Relaciona usuarios com seus papeis
-- =====================================================

CREATE TABLE UsuarioPapeis (
    IdUsuario INT NOT NULL,
    IdPapel INT NOT NULL,

    PRIMARY KEY (IdUsuario, IdPapel),

    FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario),

    FOREIGN KEY (IdPapel)
        REFERENCES Papeis(IdPapel)
);
GO


-- =====================================================
-- 4. FUNCIONARIOS
-- Cadastro dos funcionarios da unidade
-- =====================================================

CREATE TABLE Funcionarios (
    IdFuncionario INT IDENTITY(1,1) PRIMARY KEY,

    IdUsuario INT NOT NULL UNIQUE,

    CodigoFuncionario NVARCHAR(30) UNIQUE,

    FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);
GO


-- =====================================================
-- 5. ALUNOS
-- Alunos nao possuem conta ou senha
-- CPF armazenado como HMAC-SHA256
-- =====================================================

CREATE TABLE Alunos (
    IdAluno INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(150) NOT NULL,

    CPFHash VARBINARY(32) NOT NULL UNIQUE,

    Matricula NVARCHAR(30) NOT NULL UNIQUE,

    Ativo BIT NOT NULL DEFAULT 1,

    DataCadastro DATETIME2 NOT NULL
        DEFAULT SYSDATETIME()
);
GO


-- =====================================================
-- 6. MODELOS DE ENSINO
-- =====================================================

CREATE TABLE ModelosEnsino (
    IdModelo INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(50) NOT NULL UNIQUE
);
GO

INSERT INTO ModelosEnsino (Nome)
VALUES
('COMUNIDADE'),
('SEDUC');
GO


-- =====================================================
-- 7. PERIODOS
-- =====================================================

CREATE TABLE Periodos (
    IdPeriodo INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(50) NOT NULL UNIQUE
);
GO

INSERT INTO Periodos (Nome)
VALUES
('MATUTINO'),
('VESPERTINO'),
('NOTURNO');
GO


-- =====================================================
-- 8. TURMAS
-- =====================================================

CREATE TABLE Turmas (
    IdTurma INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(80) NOT NULL,

    IdModelo INT NOT NULL,
    IdPeriodo INT NOT NULL,

    AnoLetivo INT NOT NULL,

    Ativa BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (IdModelo)
        REFERENCES ModelosEnsino(IdModelo),

    FOREIGN KEY (IdPeriodo)
        REFERENCES Periodos(IdPeriodo),

    CONSTRAINT CK_Turma_Ano
        CHECK (AnoLetivo BETWEEN 2000 AND 2100)
);
GO


-- =====================================================
-- 9. MATRICULAS
-- Relaciona alunos com suas turmas
-- Mantem historico de transferencias
-- =====================================================

CREATE TABLE Matriculas (
    IdMatricula INT IDENTITY(1,1) PRIMARY KEY,

    IdAluno INT NOT NULL,
    IdTurma INT NOT NULL,

    DataMatricula DATE NOT NULL
        DEFAULT CAST(GETDATE() AS DATE),

    DataSaida DATE NULL,

    FOREIGN KEY (IdAluno)
        REFERENCES Alunos(IdAluno),

    FOREIGN KEY (IdTurma)
        REFERENCES Turmas(IdTurma),

    CONSTRAINT CK_Matricula_Datas
        CHECK (
            DataSaida IS NULL
            OR DataSaida >= DataMatricula
        )
);
GO

-- Um aluno pode ter somente uma matricula ativa

CREATE UNIQUE INDEX UQ_Matricula_Ativa
ON Matriculas (IdAluno)
WHERE DataSaida IS NULL;
GO


-- =====================================================
-- 10. PROFESSOR_TURMAS
-- Relaciona professores com suas turmas
-- =====================================================

CREATE TABLE ProfessorTurmas (
    IdProfessorTurma INT IDENTITY(1,1) PRIMARY KEY,

    IdFuncionario INT NOT NULL,
    IdTurma INT NOT NULL,

    DataInicio DATE NOT NULL
        DEFAULT CAST(GETDATE() AS DATE),

    DataFim DATE NULL,

    FOREIGN KEY (IdFuncionario)
        REFERENCES Funcionarios(IdFuncionario),

    FOREIGN KEY (IdTurma)
        REFERENCES Turmas(IdTurma),

    CONSTRAINT CK_ProfessorTurma_Datas
        CHECK (
            DataFim IS NULL
            OR DataFim >= DataInicio
        )
);
GO

CREATE UNIQUE INDEX UQ_ProfessorTurma_Ativa
ON ProfessorTurmas (IdFuncionario, IdTurma)
WHERE DataFim IS NULL;
GO


-- =====================================================
-- 11. HORARIOS DAS TURMAS
-- Permite horarios diferentes por turma e dia
-- =====================================================

CREATE TABLE HorariosTurmas (
    IdHorario INT IDENTITY(1,1) PRIMARY KEY,

    IdTurma INT NOT NULL,

    DiaSemana TINYINT NOT NULL,

    HorarioEntrada TIME NOT NULL,

    ToleranciaMinutos INT NOT NULL DEFAULT 0,

    VigenciaInicio DATE NOT NULL,

    VigenciaFim DATE NULL,

    Ativo BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (IdTurma)
        REFERENCES Turmas(IdTurma),

    CONSTRAINT CK_Horario_Dia
        CHECK (DiaSemana BETWEEN 1 AND 7),

    CONSTRAINT CK_Horario_Tolerancia
        CHECK (ToleranciaMinutos >= 0),

    CONSTRAINT CK_Horario_Vigencia
        CHECK (
            VigenciaFim IS NULL
            OR VigenciaFim >= VigenciaInicio
        )
);
GO

CREATE INDEX IX_Horarios_Turma_Dia
ON HorariosTurmas (IdTurma, DiaSemana, Ativo);
GO


-- =====================================================
-- 12. CALENDARIO LETIVO
-- Identifica os dias de atividade escolar
-- =====================================================

CREATE TABLE CalendarioLetivo (
    DataLetiva DATE PRIMARY KEY,

    DiaLetivo BIT NOT NULL,

    Descricao NVARCHAR(150) NULL
);
GO


-- =====================================================
-- 13. SOLICITACOES DE REGISTRO
-- Controla a identificacao e confirmacao do aluno
-- =====================================================

CREATE TABLE SolicitacoesRegistro (
    IdSolicitacao INT IDENTITY(1,1) PRIMARY KEY,

    TokenHash VARBINARY(32) NOT NULL UNIQUE,

    IdMatricula INT NOT NULL,

    IdHorario INT NOT NULL,

    DataSolicitacao DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    DataExpiracao DATETIME2 NOT NULL,

    DataConfirmacao DATETIME2 NULL,

    FOREIGN KEY (IdMatricula)
        REFERENCES Matriculas(IdMatricula),

    FOREIGN KEY (IdHorario)
        REFERENCES HorariosTurmas(IdHorario),

    CONSTRAINT CK_Solicitacao_Expiracao
        CHECK (DataExpiracao > DataSolicitacao)
);
GO

CREATE INDEX IX_Solicitacoes_Expiracao
ON SolicitacoesRegistro (DataExpiracao);
GO


-- =====================================================
-- 14. REGISTROS DE ATRASO
-- Armazena os atrasos confirmados pelos alunos
-- =====================================================

CREATE TABLE RegistrosAtraso (
    IdRegistro INT IDENTITY(1,1) PRIMARY KEY,

    IdMatricula INT NOT NULL,

    IdHorario INT NOT NULL,

    DataHoraRegistro DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    DataAtraso AS
        CAST(DataHoraRegistro AS DATE) PERSISTED,

    HorarioPrevisto TIME NOT NULL,

    MinutosAtraso INT NOT NULL,

    FOREIGN KEY (IdMatricula)
        REFERENCES Matriculas(IdMatricula),

    FOREIGN KEY (IdHorario)
        REFERENCES HorariosTurmas(IdHorario),

    CONSTRAINT CK_Registro_Minutos
        CHECK (MinutosAtraso > 0)
);
GO

-- Evita dois registros para a mesma matricula
-- no mesmo dia

CREATE UNIQUE INDEX UQ_Atraso_Matricula_Dia
ON RegistrosAtraso (IdMatricula, DataAtraso);
GO

CREATE INDEX IX_Atrasos_Data
ON RegistrosAtraso (DataAtraso);

CREATE INDEX IX_Atrasos_Matricula
ON RegistrosAtraso (IdMatricula, DataAtraso);
GO


-- =====================================================
-- 15. REGRAS DE RECORRENCIA
-- Define criterios de cada modelo de ensino
-- =====================================================

CREATE TABLE RegrasRecorrencia (
    IdRegra INT IDENTITY(1,1) PRIMARY KEY,

    IdModelo INT NOT NULL UNIQUE,

    TipoContagem NVARCHAR(30) NOT NULL,

    QuantidadeConsecutiva INT NOT NULL,

    ConsiderarDiasLetivos BIT NOT NULL DEFAULT 1,

    Ativa BIT NOT NULL DEFAULT 1,

    FOREIGN KEY (IdModelo)
        REFERENCES ModelosEnsino(IdModelo),

    CONSTRAINT CK_Regra_Quantidade
        CHECK (QuantidadeConsecutiva > 0),

    CONSTRAINT CK_Regra_Tipo
        CHECK (
            TipoContagem IN (
                'ATRASOS_CONSECUTIVOS',
                'DIAS_CONSECUTIVOS'
            )
        )
);
GO

-- COMUNIDADE: 3 atrasos consecutivos

INSERT INTO RegrasRecorrencia
(
    IdModelo,
    TipoContagem,
    QuantidadeConsecutiva
)
SELECT
    IdModelo,
    'ATRASOS_CONSECUTIVOS',
    3
FROM ModelosEnsino
WHERE Nome = 'COMUNIDADE';


-- SEDUC: 2 dias consecutivos

INSERT INTO RegrasRecorrencia
(
    IdModelo,
    TipoContagem,
    QuantidadeConsecutiva
)
SELECT
    IdModelo,
    'DIAS_CONSECUTIVOS',
    2
FROM ModelosEnsino
WHERE Nome = 'SEDUC';
GO


-- =====================================================
-- 16. ALERTAS DE RECORRENCIA
-- Armazena os alertas identificados pelo sistema
-- =====================================================

CREATE TABLE AlertasRecorrencia (
    IdAlerta INT IDENTITY(1,1) PRIMARY KEY,

    IdMatricula INT NOT NULL,

    IdRegra INT NOT NULL,

    DataInicioSequencia DATE NOT NULL,

    DataFimSequencia DATE NOT NULL,

    DataIdentificacao DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    QuantidadeAtrasos INT NOT NULL,

    Status NVARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    Observacao NVARCHAR(500) NULL,

    FOREIGN KEY (IdMatricula)
        REFERENCES Matriculas(IdMatricula),

    FOREIGN KEY (IdRegra)
        REFERENCES RegrasRecorrencia(IdRegra),

    CONSTRAINT CK_Alerta_Status
        CHECK (
            Status IN (
                'PENDENTE',
                'VISUALIZADO',
                'ENCERRADO'
            )
        ),

    CONSTRAINT CK_Alerta_Quantidade
        CHECK (QuantidadeAtrasos > 0),

    CONSTRAINT CK_Alerta_Datas
        CHECK (DataFimSequencia >= DataInicioSequencia)
);
GO

<<<<<<< HEAD
CREATE INDEX IX_Alertas_Status
ON AlertasRecorrencia (Status, DataIdentificacao);

CREATE INDEX IX_Alertas_Matricula
ON AlertasRecorrencia (IdMatricula, DataIdentificacao);
GO


IF NOT EXISTS (SELECT 1 FROM Periodos WHERE Nome = 'Manha')
    INSERT INTO Periodos (Nome) VALUES ('Manha');

IF NOT EXISTS (SELECT 1 FROM Periodos WHERE Nome = 'Tarde')
    INSERT INTO Periodos (Nome) VALUES ('Tarde');

IF NOT EXISTS (SELECT 1 FROM Periodos WHERE Nome = 'Noite')
    INSERT INTO Periodos (Nome) VALUES ('Noite');

IF NOT EXISTS (SELECT 1 FROM Periodos WHERE Nome = 'Integral')
    INSERT INTO Periodos (Nome) VALUES ('Integral');

SELECT * FROM Periodos;

-- =====================================================
-- FIM DA CRIACAO DO BANCO
-- =====================================================

PRINT 'Banco ControleAtrasos criado com sucesso!';
GO

=======
CREATE TABLE HorarioClasse
(
    IdHorario INT PRIMARY KEY IDENTITY(1,1),
    DiaSemana INT NOT NULL,
    HoraEntrada TIME NOT NULL,
    ToleranciaMin INT NOT NULL DEFAULT 0,
    IdTurma INT FOREIGN KEY REFERENCES Turma(IdTurma)
);
GO

CREATE TABLE SistemaAtrasos
(
    IdHistorico           INT PRIMARY KEY IDENTITY(1,1),
    IdAluno               INT        NOT NULL,
    DataAtraso            DATETIME   NOT NULL,
    MinutosAtraso         INT        NOT NULL,
    Justificativa         VARCHAR    (255),
    FOREIGN KEY (IdAluno) REFERENCES Aluno(IdAluno)
);
GO

CREATE TABLE GestaoPerfis
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
SELECT * FROM HorarioClasse;
SELECT * FROM SistemaAtrasos;
SELECT * FROM GestaoPerfis;
SELECT * FROM Educador;
SELECT * FROM RegistroChegada;
>>>>>>> a196d3b23ea039b859602402174fae7663be5ed8
