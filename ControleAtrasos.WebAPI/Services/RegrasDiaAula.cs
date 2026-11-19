using ControleAtrasos.Api.Models;

namespace ControleAtrasos.Api.Services;

/// <summary>
/// Determina dias efetivos da turma. Uma excecao da turma substitui o calendario
/// geral, e sempre e necessario um horario semanal vigente naquela data.
/// </summary>
public static class RegrasDiaAula
{
    public static int DiaSemana(DateTime data) => ((int)data.DayOfWeek + 6) % 7 + 1;

    public static bool PossuiHorario(DateTime data, IEnumerable<HorarioTurma> horarios) =>
        horarios.Any(h => h.Ativo && h.DiaSemana == DiaSemana(data) &&
            h.VigenciaInicio.Date <= data.Date &&
            (h.VigenciaFim == null || h.VigenciaFim.Value.Date >= data.Date));

    public static bool EhDiaDeAula(DateTime data, bool diaLetivoGeral, bool? excecaoTemAula,
        IEnumerable<HorarioTurma> horarios) =>
        (excecaoTemAula ?? diaLetivoGeral) && PossuiHorario(data, horarios);
}
