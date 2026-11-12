using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Exceptions;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;

namespace ControleAtrasos.Api.Services;
public sealed class RegistroService(
    IAlunoRepository alunos, IRegistroRepository registros, ISegurancaService seguranca,
    IRecorrenciaService recorrencia) : IRegistroService
{
    private static int DiaSemana(DateTime data) => ((int)data.DayOfWeek + 6) % 7 + 1;
    private static void VerificarHorario(HorarioTurma horario, DateTime agora)
    {
        if (agora.TimeOfDay < horario.HorarioEntrada.Add(TimeSpan.FromMinutes(horario.ToleranciaMinutos)))
            throw new RegraNegocioException(400, "A tolerância de entrada ainda não foi ultrapassada.");
    }
    public async Task<IdentificarResponse> IdentificarAsync(string cpf, CancellationToken ct)
    {
        var normalizado = seguranca.NormalizarCpf(cpf);
        if (!seguranca.ValidarCpf(normalizado)) throw new RegraNegocioException(400, "CPF inválido.");
        var aluno = await alunos.PorCpfHashAsync(seguranca.HashCpf(normalizado), ct);
        if (aluno is null) throw new RegraNegocioException(404, "Aluno não encontrado.");
        var hoje = DateTime.Now.Date;
        var matricula = await alunos.MatriculaAtivaAsync(aluno.IdAluno, hoje, ct);
        if (matricula is null) throw new RegraNegocioException(400, "Não existe matrícula ativa.");
        if (!await registros.EhLetivoAsync(hoje, ct)) throw new RegraNegocioException(400, "Data fora do calendário letivo.");
        var horario = await registros.HorarioAsync(matricula.IdTurma, hoje, DiaSemana(hoje), ct);
        if (horario is null) throw new RegraNegocioException(400, "Horário de entrada não cadastrado.");
        var agora = DateTime.Now;
        VerificarHorario(horario, agora);
        if (await registros.JaExisteAtrasoAsync(matricula.IdMatricula, hoje, ct))
            throw new RegraNegocioException(409, "Atraso já registrado nesta data.");
        var token = seguranca.NovoToken();
        await registros.CriarSolicitacaoAsync(new SolicitacaoRegistro {
            IdMatricula = matricula.IdMatricula, IdHorario = horario.IdHorario,
            TokenHash = seguranca.HashToken(token), DataSolicitacao = agora,
            DataExpiracao = agora.AddMinutes(3)
        }, ct);
        return new(aluno.Nome, matricula.NomeTurma, horario.HorarioEntrada.ToString(@"hh\:mm"),
            Math.Max(0, (int)(agora.TimeOfDay - horario.HorarioEntrada).TotalMinutes), token, agora.AddMinutes(3));
    }
    public async Task<ConfirmarResponse> ConfirmarAsync(string token, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token) || token.Length != 64 || !token.All(Uri.IsHexDigit))
            throw new RegraNegocioException(400, "Token de confirmação inválido.");
        await using var tx = await registros.IniciarTransacaoAsync(ct);
        var agora = DateTime.Now;
        var hoje = agora.Date;
        var solicitacao = await registros.BuscarSolicitacaoAsync(seguranca.HashToken(token), ct);
        if (solicitacao == null || solicitacao.DataConfirmacao != null ||
            solicitacao.DataExpiracao < agora || solicitacao.DataSolicitacao.Date != hoje)
            throw new RegraNegocioException(400, "Solicitação inválida, utilizada ou expirada.");
        var matricula = await registros.MatriculaAsync(solicitacao.IdMatricula, ct);
        var horario = await registros.HorarioPorIdAsync(solicitacao.IdHorario, ct);
        if (matricula == null || horario == null ||
            !await registros.AlunoTurmaAtivosAsync(matricula, ct) ||
            matricula.DataMatricula > hoje || matricula.DataSaida < hoje ||
            horario.IdTurma != matricula.IdTurma || !horario.Ativo ||
            horario.DiaSemana != DiaSemana(hoje) || horario.VigenciaInicio > hoje ||
            horario.VigenciaFim < hoje)
            throw new RegraNegocioException(400, "Matrícula ou horário não está mais válido.");
        if (!await registros.EhLetivoAsync(hoje, ct))
            throw new RegraNegocioException(400, "Hoje não é dia letivo.");
        VerificarHorario(horario, agora);
        if (await registros.JaExisteAtrasoAsync(matricula.IdMatricula, hoje, ct))
            throw new RegraNegocioException(409, "Atraso já registrado nesta data.");
        var atraso = new RegistroAtraso {
            IdMatricula = matricula.IdMatricula, IdHorario = horario.IdHorario,
            DataHoraRegistro = agora, HorarioPrevisto = horario.HorarioEntrada,
            MinutosAtraso = Math.Max(0, (int)(agora.TimeOfDay - horario.HorarioEntrada).TotalMinutes)
        };
        await registros.AdicionarAtrasoAsync(atraso, ct);
        solicitacao.DataConfirmacao = agora;
        await registros.SalvarAsync(ct);
        await recorrencia.VerificarAsync(matricula.IdMatricula, hoje, ct);
        await registros.SalvarAsync(ct);
        await tx.CommitAsync(ct);
        return new(atraso.IdRegistro, atraso.DataHoraRegistro, atraso.MinutosAtraso);
    }
}
