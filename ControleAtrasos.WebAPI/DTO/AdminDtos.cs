using System.ComponentModel.DataAnnotations;
namespace ControleAtrasos.Api.DTO;
public sealed class CriarAlunoRequest
{
    [Required, MaxLength(150)] public string Nome { get; set; } = "";
    [Required] public string Cpf { get; set; } = "";
    [Required, MaxLength(60)] public string Matricula { get; set; } = "";
}
public sealed class AtualizarAlunoRequest
{
    [Required, MaxLength(150)] public string Nome { get; set; } = "";
    public bool Ativo { get; set; }
}
public sealed record AlunoResponse(int IdAluno, string Nome, string Matricula, bool Ativo);
public sealed class CriarFuncionarioRequest
{
    [Required, MaxLength(150)] public string Nome { get; set; } = "";
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required, MinLength(12)] public string Senha { get; set; } = "";
    [Required, MinLength(1)] public string[] Papeis { get; set; } = [];
    [MaxLength(60)] public string? CodigoFuncionario { get; set; }
}
public sealed record FuncionarioResponse(int IdUsuario, int IdFuncionario, string Nome, string Email, bool Ativo, string[] Papeis);
public sealed class AtualizarFuncionarioRequest
{
    [Required, MaxLength(150)] public string Nome { get; set; } = "";
    public bool Ativo { get; set; }
    [Required, MinLength(1)] public string[] Papeis { get; set; } = [];
}
public sealed class CriarTurmaRequest
{
    [Required, MaxLength(100)] public string Nome { get; set; } = "";
    [Range(1, int.MaxValue)] public int IdModelo { get; set; }
    [Range(1, int.MaxValue)] public int IdPeriodo { get; set; }
    [Range(2020, 2100)] public int AnoLetivo { get; set; }
}
public sealed class AtualizarTurmaRequest
{
    [Required, MaxLength(100)] public string Nome { get; set; } = "";
    public bool Ativa { get; set; }
}
public sealed class CriarMatriculaRequest
{
    [Range(1, int.MaxValue)] public int IdAluno { get; set; }
    [Range(1, int.MaxValue)] public int IdTurma { get; set; }
    public DateTime DataMatricula { get; set; }
    public DateTime? DataSaida { get; set; }
}
public sealed class CriarProfessorTurmaRequest
{
    [Range(1, int.MaxValue)] public int IdFuncionario { get; set; }
    [Range(1, int.MaxValue)] public int IdTurma { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
}
public sealed class CriarHorarioRequest
{
    [Range(1, int.MaxValue)] public int IdTurma { get; set; }
    [Range(1, 7)] public int DiaSemana { get; set; }
    public TimeSpan HorarioEntrada { get; set; }
    [Range(0, 120)] public int ToleranciaMinutos { get; set; }
    public DateTime VigenciaInicio { get; set; }
    public DateTime? VigenciaFim { get; set; }
}
public sealed class AtualizarHorarioRequest
{
    public TimeSpan HorarioEntrada { get; set; }
    [Range(0, 120)] public int ToleranciaMinutos { get; set; }
    public bool Ativo { get; set; }
}
public sealed class CalendarioRequest
{
    public bool DiaLetivo { get; set; }
    [MaxLength(255)] public string? Descricao { get; set; }
}
