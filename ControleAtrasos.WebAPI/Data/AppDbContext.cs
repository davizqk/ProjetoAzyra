using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Papel> Papeis => Set<Papel>();
    public DbSet<UsuarioPapel> UsuarioPapeis => Set<UsuarioPapel>();
    public DbSet<Funcionario> Funcionarios => Set<Funcionario>();
    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<ModeloEnsino> ModelosEnsino => Set<ModeloEnsino>();
    public DbSet<Periodo> Periodos => Set<Periodo>();
    public DbSet<Turma> Turmas => Set<Turma>();
    public DbSet<Matricula> Matriculas => Set<Matricula>();
    public DbSet<ProfessorTurma> ProfessorTurmas => Set<ProfessorTurma>();
    public DbSet<HorarioTurma> HorariosTurmas => Set<HorarioTurma>();
    public DbSet<DiaCalendario> CalendarioLetivo => Set<DiaCalendario>();
    public DbSet<SolicitacaoRegistro> SolicitacoesRegistro => Set<SolicitacaoRegistro>();
    public DbSet<RegistroAtraso> RegistrosAtraso => Set<RegistroAtraso>();
    public DbSet<RegraRecorrencia> RegrasRecorrencia => Set<RegraRecorrencia>();
    public DbSet<AlertaRecorrencia> AlertasRecorrencia => Set<AlertaRecorrencia>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var m = modelBuilder;
        m.Entity<Usuario>().ToTable("Usuarios").HasKey(x => x.IdUsuario);
        m.Entity<Usuario>().HasIndex(x => x.Email).IsUnique();
        m.Entity<Papel>().ToTable("Papeis").HasKey(x => x.IdPapel);
        m.Entity<UsuarioPapel>().ToTable("UsuarioPapeis").HasKey(x => new { x.IdUsuario, x.IdPapel });
        m.Entity<Funcionario>().ToTable("Funcionarios").HasKey(x => x.IdFuncionario);
        m.Entity<Aluno>().ToTable("Alunos").HasKey(x => x.IdAluno);
        m.Entity<Aluno>().Property(x => x.CPFHash).HasColumnType("varbinary(32)");
        m.Entity<ModeloEnsino>().ToTable("ModelosEnsino").HasKey(x => x.IdModelo);
        m.Entity<Periodo>().ToTable("Periodos").HasKey(x => x.IdPeriodo);
        m.Entity<Turma>().ToTable("Turmas").HasKey(x => x.IdTurma);
        m.Entity<Matricula>().ToTable("Matriculas").HasKey(x => x.IdMatricula);
        m.Entity<Matricula>().Property(x => x.DataMatricula).HasColumnType("date");
        m.Entity<Matricula>().Property(x => x.DataSaida).HasColumnType("date");
        m.Entity<ProfessorTurma>().ToTable("ProfessorTurmas").HasKey(x => x.IdProfessorTurma);
        m.Entity<ProfessorTurma>().Property(x => x.DataInicio).HasColumnType("date");
        m.Entity<ProfessorTurma>().Property(x => x.DataFim).HasColumnType("date");
        m.Entity<HorarioTurma>().ToTable("HorariosTurmas").HasKey(x => x.IdHorario);
        m.Entity<HorarioTurma>().Property(x => x.HorarioEntrada).HasColumnType("time");
        m.Entity<HorarioTurma>().Property(x => x.VigenciaInicio).HasColumnType("date");
        m.Entity<HorarioTurma>().Property(x => x.VigenciaFim).HasColumnType("date");
        m.Entity<DiaCalendario>().ToTable("CalendarioLetivo").HasKey(x => x.DataLetiva);
        m.Entity<DiaCalendario>().Property(x => x.DataLetiva).HasColumnType("date");
        m.Entity<SolicitacaoRegistro>().ToTable("SolicitacoesRegistro").HasKey(x => x.IdSolicitacao);
        m.Entity<SolicitacaoRegistro>().Property(x => x.TokenHash).HasColumnType("varbinary(32)");
        m.Entity<RegistroAtraso>().ToTable("RegistrosAtraso").HasKey(x => x.IdRegistro);
        m.Entity<RegistroAtraso>().Property(x => x.DataAtraso)
            .HasComputedColumnSql("CAST([DataHoraRegistro] AS date)", stored: true);
        m.Entity<RegistroAtraso>().Property(x => x.HorarioPrevisto).HasColumnType("time");
        m.Entity<RegraRecorrencia>().ToTable("RegrasRecorrencia").HasKey(x => x.IdRegra);
        m.Entity<AlertaRecorrencia>().ToTable("AlertasRecorrencia").HasKey(x => x.IdAlerta);
        m.Entity<AlertaRecorrencia>().Property(x => x.DataInicioSequencia).HasColumnType("date");
        m.Entity<AlertaRecorrencia>().Property(x => x.DataFimSequencia).HasColumnType("date");
    }
}
