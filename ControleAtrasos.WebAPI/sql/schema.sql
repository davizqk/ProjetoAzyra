-- SQL Server. Execute em banco vazio ControleAtrasos.
-- Ajuste para seu DDL existente caso as tabelas ja tenham sido criadas.
CREATE TABLE dbo.Usuarios (
 IdUsuario int IDENTITY PRIMARY KEY, Nome nvarchar(150) NOT NULL,
 Email nvarchar(254) NOT NULL UNIQUE, SenhaHash nvarchar(255) NOT NULL,
 Ativo bit NOT NULL DEFAULT 1, DataCriacao datetime2 NOT NULL DEFAULT SYSDATETIME()
);
CREATE TABLE dbo.Papeis (IdPapel int IDENTITY PRIMARY KEY, Nome nvarchar(40) NOT NULL UNIQUE);
CREATE TABLE dbo.UsuarioPapeis (
 IdUsuario int NOT NULL REFERENCES dbo.Usuarios(IdUsuario),
 IdPapel int NOT NULL REFERENCES dbo.Papeis(IdPapel),
 CONSTRAINT PK_UsuarioPapeis PRIMARY KEY(IdUsuario, IdPapel)
);
CREATE TABLE dbo.Funcionarios (
 IdFuncionario int IDENTITY PRIMARY KEY,
 IdUsuario int NOT NULL UNIQUE REFERENCES dbo.Usuarios(IdUsuario),
 CodigoFuncionario nvarchar(60) NULL
);
CREATE TABLE dbo.Alunos (
 IdAluno int IDENTITY PRIMARY KEY, Nome nvarchar(150) NOT NULL,
 CPFHash varbinary(32) NOT NULL UNIQUE, Matricula nvarchar(60) NOT NULL UNIQUE,
 Ativo bit NOT NULL DEFAULT 1, DataCadastro datetime2 NOT NULL DEFAULT SYSDATETIME()
);
CREATE TABLE dbo.ModelosEnsino (IdModelo int IDENTITY PRIMARY KEY, Nome nvarchar(80) NOT NULL UNIQUE);
CREATE TABLE dbo.Periodos (IdPeriodo int IDENTITY PRIMARY KEY, Nome nvarchar(80) NOT NULL UNIQUE);
CREATE TABLE dbo.Turmas (
 IdTurma int IDENTITY PRIMARY KEY, Nome nvarchar(100) NOT NULL,
 IdModelo int NOT NULL REFERENCES dbo.ModelosEnsino(IdModelo),
 IdPeriodo int NOT NULL REFERENCES dbo.Periodos(IdPeriodo),
 AnoLetivo int NOT NULL, Ativa bit NOT NULL DEFAULT 1
);
CREATE TABLE dbo.Matriculas (
 IdMatricula int IDENTITY PRIMARY KEY,
 IdAluno int NOT NULL REFERENCES dbo.Alunos(IdAluno),
 IdTurma int NOT NULL REFERENCES dbo.Turmas(IdTurma),
 DataMatricula date NOT NULL, DataSaida date NULL
);
CREATE TABLE dbo.ProfessorTurmas (
 IdProfessorTurma int IDENTITY PRIMARY KEY,
 IdFuncionario int NOT NULL REFERENCES dbo.Funcionarios(IdFuncionario),
 IdTurma int NOT NULL REFERENCES dbo.Turmas(IdTurma),
 DataInicio date NOT NULL, DataFim date NULL
);
CREATE TABLE dbo.HorariosTurmas (
 IdHorario int IDENTITY PRIMARY KEY,
 IdTurma int NOT NULL REFERENCES dbo.Turmas(IdTurma),
 DiaSemana int NOT NULL CHECK (DiaSemana BETWEEN 1 AND 7),
 HorarioEntrada time NOT NULL, ToleranciaMinutos int NOT NULL DEFAULT 0
    CHECK (ToleranciaMinutos BETWEEN 0 AND 120),
 VigenciaInicio date NOT NULL, VigenciaFim date NULL,
 Ativo bit NOT NULL DEFAULT 1
);
CREATE TABLE dbo.CalendarioLetivo (
 DataLetiva date PRIMARY KEY, DiaLetivo bit NOT NULL,
 Descricao nvarchar(255) NULL
);
CREATE TABLE dbo.SolicitacoesRegistro (
 IdSolicitacao int IDENTITY PRIMARY KEY,
 TokenHash varbinary(32) NOT NULL UNIQUE,
 IdMatricula int NOT NULL REFERENCES dbo.Matriculas(IdMatricula),
 IdHorario int NOT NULL REFERENCES dbo.HorariosTurmas(IdHorario),
 DataSolicitacao datetime2 NOT NULL,
 DataExpiracao datetime2 NOT NULL,
 DataConfirmacao datetime2 NULL
);
CREATE TABLE dbo.RegistrosAtraso (
 IdRegistro int IDENTITY PRIMARY KEY,
 IdMatricula int NOT NULL REFERENCES dbo.Matriculas(IdMatricula),
 IdHorario int NOT NULL REFERENCES dbo.HorariosTurmas(IdHorario),
 DataHoraRegistro datetime2 NOT NULL,
 DataAtraso AS CAST(DataHoraRegistro AS date) PERSISTED,
 HorarioPrevisto time NOT NULL, MinutosAtraso int NOT NULL CHECK (MinutosAtraso >= 0)
);
CREATE UNIQUE INDEX UX_RegistrosAtraso_Matricula_Data ON dbo.RegistrosAtraso(IdMatricula, DataAtraso);
CREATE TABLE dbo.RegrasRecorrencia (
 IdRegra int IDENTITY PRIMARY KEY,
 IdModelo int NOT NULL REFERENCES dbo.ModelosEnsino(IdModelo),
 TipoContagem nvarchar(50) NOT NULL,
 QuantidadeConsecutiva int NOT NULL CHECK (QuantidadeConsecutiva > 0),
 ConsiderarDiasLetivos bit NOT NULL DEFAULT 1, Ativa bit NOT NULL DEFAULT 1
);
CREATE TABLE dbo.AlertasRecorrencia (
 IdAlerta int IDENTITY PRIMARY KEY,
 IdMatricula int NOT NULL REFERENCES dbo.Matriculas(IdMatricula),
 IdRegra int NOT NULL REFERENCES dbo.RegrasRecorrencia(IdRegra),
 DataInicioSequencia date NOT NULL, DataFimSequencia date NOT NULL,
 DataIdentificacao datetime2 NOT NULL DEFAULT SYSDATETIME(),
 QuantidadeAtrasos int NOT NULL, Status nvarchar(20) NOT NULL DEFAULT 'PENDENTE',
 Observacao nvarchar(1000) NULL
);
INSERT INTO dbo.Papeis(Nome) VALUES ('PROFESSOR'), ('AQV'), ('COORDENACAO'), ('ADMIN');
INSERT INTO dbo.ModelosEnsino(Nome) VALUES ('Comunidade'), ('SEDUC');
INSERT INTO dbo.Periodos(Nome) VALUES ('Manha'), ('Tarde'), ('Noite');
INSERT INTO dbo.RegrasRecorrencia(IdModelo, TipoContagem, QuantidadeConsecutiva, ConsiderarDiasLetivos, Ativa)
SELECT IdModelo, 'DIAS_LETIVOS_CONSECUTIVOS', CASE WHEN Nome = 'Comunidade' THEN 3 ELSE 2 END, 1, 1
FROM dbo.ModelosEnsino;
