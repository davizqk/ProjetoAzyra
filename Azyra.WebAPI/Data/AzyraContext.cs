using Azyra.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Data;

public class AzyraContext : DbContext
{
    public AzyraContext(DbContextOptions<AzyraContext> options) : base(options) { }

    public virtual DbSet<ModeloEnsino> ModeloEnsino => Set<ModeloEnsino>();
    public virtual DbSet<Periodo> Periodo => Set<Periodo>();
    public virtual DbSet<Turma> Turma => Set<Turma>();
    public virtual DbSet<Aluno> Aluno => Set<Aluno>();
    public virtual DbSet<HorarioTurma> HorarioTurma => Set<HorarioTurma>();
    public virtual DbSet<HistoricoAtraso> HistoricoAtraso => Set<HistoricoAtraso>();
    public virtual DbSet<AlertaRecorrencia> AlertaRecorrencia => Set<AlertaRecorrencia>();
    public virtual DbSet<QRCode> QRCode => Set<QRCode>();
    public virtual DbSet<PerfilAcesso> PerfilAcesso => Set<PerfilAcesso>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ModeloEnsino>(entity =>
        {
            entity.HasKey(e => e.IdModelo);
            entity.Property(e => e.Nome).HasMaxLength(30).IsUnicode(false);
            entity.Property(e => e.Descricao).HasMaxLength(200).IsUnicode(false);
        });
        modelBuilder.Entity<Periodo>(entity =>
        {
            entity.HasKey(e => e.IdPeriodo);
            entity.Property(e => e.Nome).HasMaxLength(30).IsUnicode(false);
            entity.ToTable(t => t.HasCheckConstraint("CK_Periodo_Horarios", "[HoraFim] > [HoraInicio]"));
        });
        modelBuilder.Entity<Turma>(entity =>
        {
            entity.HasKey(e => e.IdTurma);
            entity.Property(e => e.Nome).HasMaxLength(80).IsUnicode(false);
            entity.HasOne<ModeloEnsino>().WithMany().HasForeignKey(e => e.IdModelo).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne<Periodo>().WithMany().HasForeignKey(e => e.IdPeriodo).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.HasKey(e => e.IdAluno);
            entity.Property(e => e.Nome).HasMaxLength(120).IsUnicode(false);
            entity.Property(e => e.CPF).HasMaxLength(11).IsUnicode(false);
            entity.HasIndex(e => e.CPF).IsUnique().HasFilter("[CPF] IS NOT NULL");
            entity.HasOne<Turma>().WithMany().HasForeignKey(e => e.IdTurma).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<HorarioTurma>(entity =>
        {
            entity.HasKey(e => e.IdHorario);
            entity.HasIndex(e => new { e.IdTurma, e.DiaSemana }).IsUnique();
            entity.ToTable(t => {
                t.HasCheckConstraint("CK_HorarioTurma_DiaSemana", "[DiaSemana] BETWEEN 1 AND 7");
                t.HasCheckConstraint("CK_HorarioTurma_Tolerancia", "[ToleranciaMin] >= 0");
            });
            entity.HasOne<Turma>().WithMany().HasForeignKey(e => e.IdTurma).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<HistoricoAtraso>(entity =>
        {
            entity.HasKey(e => e.IdHistorico);
            entity.HasIndex(e => e.Data);
            entity.Property(e => e.Data).HasColumnType("datetime2");
            entity.Property(e => e.HoraChegada).HasColumnType("time");
            entity.ToTable(t => t.HasCheckConstraint("CK_HistoricoAtraso_Consecutivo", "[ConsecutivoAtual] >= 0"));
            entity.HasOne<Aluno>().WithMany().HasForeignKey(e => e.IdAluno).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<AlertaRecorrencia>(entity =>
        {
            entity.HasKey(e => e.IdAlerta);
            entity.Property(e => e.GeradoEm).HasColumnType("datetime2").HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Status).HasMaxLength(20).IsUnicode(false).HasDefaultValue("Pendente");
            entity.ToTable(t => {
                t.HasCheckConstraint("CK_AlertaRecorrencia_Quantidade", "[QuantidadeDetectada] >= 0");
                t.HasCheckConstraint("CK_AlertaRecorrencia_Status", "[Status] IN ('Pendente', 'Em acompanhamento', 'Resolvido')");
            });
            entity.HasOne<Aluno>().WithMany().HasForeignKey(e => e.IdAluno).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<QRCode>(entity =>
        {
            entity.HasKey(e => e.IdQR);
            entity.Property(e => e.TokenHash).HasMaxLength(255).IsUnicode(false);
            entity.HasIndex(e => e.TokenHash).IsUnique();
            entity.Property(e => e.GeradoEm).HasColumnType("datetime2").HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Ativo).HasDefaultValue(true);
            entity.ToTable(t => t.HasCheckConstraint("CK_QRCode_Expiracao", "[ExpiraEm] > [GeradoEm]"));
            entity.HasOne<Turma>().WithMany().HasForeignKey(e => e.IdTurma).OnDelete(DeleteBehavior.NoAction);
        });
        modelBuilder.Entity<PerfilAcesso>(entity =>
        {
            entity.HasKey(e => e.IdPerfil);
            entity.Property(e => e.Nome).HasMaxLength(40).IsUnicode(false);
            entity.Property(e => e.Permissoes).HasMaxLength(500).IsUnicode(false);
        });
    }
}
