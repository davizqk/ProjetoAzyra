using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Exceptions;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;

namespace ControleAtrasos.Api.Services;
public sealed class AdministracaoService(
    IAlunoRepository alunos, IUsuarioRepository usuarios, ICadastroRepository cadastros,
    ISegurancaService seguranca) : IAdministracaoService
{
    private static RegraNegocioException Erro(string msg, int code = 400) => new(code, msg);
    private static IReadOnlyList<string> NormalizarPapeis(string[] papeis)
    {
        var validos = new[] { "PROFESSOR", "AQV", "COORDENACAO", "ADMIN" };
        var normalized = papeis.Select(x => x.Trim().ToUpperInvariant()).Distinct().ToArray();
        if (normalized.Length == 0 || normalized.Any(p => !validos.Contains(p)))
            throw Erro("Informe papéis válidos: PROFESSOR, AQV, COORDENACAO, ADMIN.");
        return normalized;
    }
    public async Task<AlunoResponse> CriarAlunoAsync(CriarAlunoRequest req, CancellationToken ct)
    {
        var cpf = seguranca.NormalizarCpf(req.Cpf);
        if (!seguranca.ValidarCpf(cpf)) throw Erro("CPF inválido.");
        var nome = req.Nome.Trim(); var numero = req.Matricula.Trim();
        if (nome.Length == 0 || numero.Length == 0) throw Erro("Nome e matrícula são obrigatórios.");
        var hash = seguranca.HashCpf(cpf);
        if (await alunos.CpfOuMatriculaExisteAsync(hash, numero, ct)) throw Erro("CPF ou matrícula já cadastrado.", 409);
        var novo = await alunos.CriarAsync(new Aluno {
            Nome = nome, CPFHash = hash, Matricula = numero, Ativo = true, DataCadastro = DateTime.Now
        }, ct);
        return new(novo.IdAluno, novo.Nome, novo.Matricula, novo.Ativo);
    }
    public async Task<AlunoResponse> AtualizarAlunoAsync(int id, AtualizarAlunoRequest req, CancellationToken ct)
    {
        var aluno = await alunos.PorIdAsync(id, ct) ?? throw Erro("Aluno não encontrado.", 404);
        if (string.IsNullOrWhiteSpace(req.Nome)) throw Erro("Nome obrigatório.");
        aluno.Nome = req.Nome.Trim(); aluno.Ativo = req.Ativo;
        await alunos.SalvarAsync(ct);
        return new(aluno.IdAluno, aluno.Nome, aluno.Matricula, aluno.Ativo);
    }
    public async Task<IReadOnlyList<AlunoResponse>> AlunosAsync(CancellationToken ct) =>
        (await alunos.ListarAsync(ct)).Select(x => new AlunoResponse(x.IdAluno, x.Nome, x.Matricula, x.Ativo)).ToArray();

    public async Task<FuncionarioResponse> CriarFuncionarioAsync(CriarFuncionarioRequest req, CancellationToken ct)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(req.Nome) || req.Senha.Length < 12 || !email.Contains('@'))
            throw Erro("Informe nome, e-mail e senha de no mínimo 12 caracteres.");
        if (await usuarios.EmailExisteAsync(email, ct)) throw Erro("E-mail já cadastrado.", 409);
        var papeis = NormalizarPapeis(req.Papeis);
        var dados = await usuarios.CriarFuncionarioAsync(new Usuario {
            Nome = req.Nome.Trim(), Email = email, SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.Senha),
            Ativo = true, DataCriacao = DateTime.Now
        }, req.CodigoFuncionario?.Trim(), papeis, ct);
        return new(dados.IdUsuario, dados.IdFuncionario, dados.Nome, dados.Email, dados.Ativo, dados.Papeis);
    }
    public async Task<IReadOnlyList<FuncionarioResponse>> FuncionariosAsync(CancellationToken ct) =>
        (await usuarios.ListarFuncionariosAsync(ct)).Select(x => new FuncionarioResponse(
            x.IdUsuario, x.IdFuncionario, x.Nome, x.Email, x.Ativo, x.Papeis)).ToArray();
    public async Task<FuncionarioResponse> AtualizarFuncionarioAsync(int id, AtualizarFuncionarioRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Nome)) throw Erro("Nome obrigatório.");
        var papeis = NormalizarPapeis(req.Papeis);
        var result = await usuarios.AtualizarFuncionarioAsync(id, req.Nome.Trim(), req.Ativo, papeis, ct)
            ?? throw Erro("Funcionário não encontrado.", 404);
        return new(result.IdUsuario, result.IdFuncionario, result.Nome, result.Email, result.Ativo, result.Papeis);
    }
    public async Task<Turma> CriarTurmaAsync(CriarTurmaRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Nome) ||
            !await cadastros.ExisteModeloPeriodoAsync(req.IdModelo, req.IdPeriodo, ct))
            throw Erro("Nome, modelo ou período inválido.");
        return await cadastros.CriarTurmaAsync(new Turma {
            Nome = req.Nome.Trim(), IdModelo = req.IdModelo, IdPeriodo = req.IdPeriodo,
            AnoLetivo = req.AnoLetivo, Ativa = true
        }, ct);
    }
    public async Task<Turma> AtualizarTurmaAsync(int id, AtualizarTurmaRequest req, CancellationToken ct)
    {
        var turma = await cadastros.TurmaPorIdAsync(id, ct) ?? throw Erro("Turma não encontrada.", 404);
        turma.Nome = req.Nome.Trim(); turma.Ativa = req.Ativa;
        await cadastros.SalvarAsync(ct);
        return turma;
    }
    public async Task<Matricula> CriarMatriculaAsync(CriarMatriculaRequest req, CancellationToken ct)
    {
        var inicio = req.DataMatricula.Date; var fim = req.DataSaida?.Date;
        if (inicio == default || fim < inicio ||
            !await cadastros.AlunoTurmaExistemAsync(req.IdAluno, req.IdTurma, ct))
            throw Erro("Aluno, turma ou datas inválidas.");
        if (await cadastros.MatriculaSobrepostaAsync(req.IdAluno, inicio, fim, ct))
            throw Erro("Aluno já possui matrícula com vigência sobreposta.", 409);
        return await cadastros.CriarMatriculaAsync(new Matricula {
            IdAluno = req.IdAluno, IdTurma = req.IdTurma, DataMatricula = inicio, DataSaida = fim
        }, ct);
    }
    public async Task<ProfessorTurma> VincularProfessorAsync(CriarProfessorTurmaRequest req, CancellationToken ct)
    {
        if (req.DataInicio == default || req.DataFim < req.DataInicio ||
            !await cadastros.FuncionarioExisteAsync(req.IdFuncionario, ct) ||
            await cadastros.TurmaPorIdAsync(req.IdTurma, ct) == null)
            throw Erro("Funcionário, turma ou datas inválidas.");
        return await cadastros.AtribuirProfessorAsync(new ProfessorTurma {
            IdFuncionario = req.IdFuncionario, IdTurma = req.IdTurma,
            DataInicio = req.DataInicio.Date, DataFim = req.DataFim?.Date
        }, ct);
    }
    public async Task<HorarioTurma> CriarHorarioAsync(CriarHorarioRequest req, CancellationToken ct)
    {
        if (req.VigenciaInicio == default || req.VigenciaFim < req.VigenciaInicio ||
            req.HorarioEntrada < TimeSpan.Zero || req.HorarioEntrada >= TimeSpan.FromDays(1) ||
            await cadastros.TurmaPorIdAsync(req.IdTurma, ct) == null)
            throw Erro("Turma, horário ou vigência inválidos.");
        return await cadastros.CriarHorarioAsync(new HorarioTurma {
            IdTurma = req.IdTurma, DiaSemana = req.DiaSemana,
            HorarioEntrada = req.HorarioEntrada, ToleranciaMinutos = req.ToleranciaMinutos,
            VigenciaInicio = req.VigenciaInicio.Date, VigenciaFim = req.VigenciaFim?.Date, Ativo = true
        }, ct);
    }
    public async Task<HorarioTurma> AtualizarHorarioAsync(int id, AtualizarHorarioRequest req, CancellationToken ct)
    {
        var horario = await cadastros.HorarioPorIdAsync(id, ct) ?? throw Erro("Horário não encontrado.", 404);
        if (req.HorarioEntrada < TimeSpan.Zero || req.HorarioEntrada >= TimeSpan.FromDays(1))
            throw Erro("Horário inválido.");
        horario.HorarioEntrada = req.HorarioEntrada;
        horario.ToleranciaMinutos = req.ToleranciaMinutos;
        horario.Ativo = req.Ativo;
        await cadastros.SalvarAsync(ct);
        return horario;
    }
    public Task AtualizarDiaLetivoAsync(DateTime data, CalendarioRequest req, CancellationToken ct) =>
        cadastros.SalvarDiaLetivoAsync(new DiaCalendario {
            DataLetiva = data.Date, DiaLetivo = req.DiaLetivo, Descricao = req.Descricao
        }, ct);
}
