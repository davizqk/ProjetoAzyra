using System;
using System.Collections.Generic;
using Azyra.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Data;

public partial class AzyraContext : DbContext
{
    public AzyraContext(DbContextOptions<AzyraContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AlertaRecorrencium> AlertaRecorrencia { get; set; }

    public virtual DbSet<Aluno> Alunos { get; set; }

    public virtual DbSet<HistoricoAtraso> HistoricoAtrasos { get; set; }

    public virtual DbSet<HorarioTurma> HorarioTurmas { get; set; }

    public virtual DbSet<ModeloEnsino> ModeloEnsinos { get; set; }

    public virtual DbSet<PerfilAcesso> PerfilAcessos { get; set; }

    public virtual DbSet<Periodo> Periodos { get; set; }

    public virtual DbSet<QRCode> Qrcodes { get; set; }

    public virtual DbSet<Turma> Turmas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlertaRecorrencium>(entity =>
        {
            entity.HasKey(e => e.IdAlerta).HasName("PK__AlertaRe__D2CDBC4F6DEE484B");

            entity.Property(e => e.GeradoEm).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pendente");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.AlertaRecorrencia)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AlertaRecorrencia_Aluno");
        });

        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.HasKey(e => e.IdAluno).HasName("PK__Aluno__8092FCB39105707F");

            entity.ToTable("Aluno");

            entity.HasIndex(e => e.Matricula, "UQ__Aluno__0FB9FB4F6738CE8A").IsUnique();

            entity.Property(e => e.Matricula)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(120)
                .IsUnicode(false);

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.Alunos)
                .HasForeignKey(d => d.IdTurma)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Aluno_Turma");
        });

        modelBuilder.Entity<HistoricoAtraso>(entity =>
        {
            entity.HasKey(e => e.IdHistorico).HasName("PK__Historic__9CC7EBF3F53C1365");

            entity.ToTable("HistoricoAtraso");

            entity.HasIndex(e => new { e.IdAluno, e.Data }, "UQ_HistoricoAtraso_Aluno_Data").IsUnique();

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.HistoricoAtrasos)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HistoricoAtraso_Aluno");
        });

        modelBuilder.Entity<HorarioTurma>(entity =>
        {
            entity.HasKey(e => e.IdHorario).HasName("PK__HorarioT__1539229B2E5E0B4B");

            entity.ToTable("HorarioTurma");

            entity.HasIndex(e => new { e.IdTurma, e.DiaSemana }, "UQ_HorarioTurma_Turma_Dia").IsUnique();

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.HorarioTurmas)
                .HasForeignKey(d => d.IdTurma)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HorarioTurma_Turma");
        });

        modelBuilder.Entity<ModeloEnsino>(entity =>
        {
            entity.HasKey(e => e.IdModelo).HasName("PK__ModeloEn__CC30D30C9835A472");

            entity.ToTable("ModeloEnsino");

            entity.Property(e => e.Descricao)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PerfilAcesso>(entity =>
        {
            entity.HasKey(e => e.IdPerfil).HasName("PK__PerfilAc__C7BD5CC13A04E24C");

            entity.ToTable("PerfilAcesso");

            entity.Property(e => e.Nome)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.Permissoes)
                .HasMaxLength(500)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Periodo>(entity =>
        {
            entity.HasKey(e => e.IdPeriodo).HasName("PK__Periodo__B44699FE3F6A59F8");

            entity.ToTable("Periodo");

            entity.Property(e => e.Nome)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<QRCode>(entity =>
        {
            entity.HasKey(e => e.IdQr).HasName("PK__QRCode__B77022C24272D341");

            entity.ToTable("QRCode");

            entity.HasIndex(e => e.TokenHash, "UQ__QRCode__BCB33F921F99C4EA").IsUnique();

            entity.Property(e => e.IdQr).HasColumnName("IdQR");
            entity.Property(e => e.Ativo).HasDefaultValue(true);
            entity.Property(e => e.GeradoEm).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TokenHash)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.Qrcodes)
                .HasForeignKey(d => d.IdTurma)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QRCode_Turma");
        });

        modelBuilder.Entity<Turma>(entity =>
        {
            entity.HasKey(e => e.IdTurma).HasName("PK__Turma__C1ECFFC96D1D2757");

            entity.ToTable("Turma");

            entity.Property(e => e.Nome)
                .HasMaxLength(80)
                .IsUnicode(false);

            entity.HasOne(d => d.IdModeloNavigation).WithMany(p => p.Turmas)
                .HasForeignKey(d => d.IdModelo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Turma_ModeloEnsino");

            entity.HasOne(d => d.IdPeriodoNavigation).WithMany(p => p.Turmas)
                .HasForeignKey(d => d.IdPeriodo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Turma_Periodo");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
