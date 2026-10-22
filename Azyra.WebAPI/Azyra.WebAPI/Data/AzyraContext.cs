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

    public virtual DbSet<Qrcode> Qrcodes { get; set; }

    public virtual DbSet<Turma> Turmas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlertaRecorrencium>(entity =>
        {
            entity.HasKey(e => e.IdAlerta).HasName("PK__AlertaRe__D2CDBC4F7CB29D67");

            entity.Property(e => e.GeradoEm)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pendente");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.AlertaRecorrencia)
                .HasForeignKey(d => d.IdAluno)
                .HasConstraintName("FK__AlertaRec__IdAlu__5BE2A6F2");
        });

        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.HasKey(e => e.IdAluno).HasName("PK__Aluno__8092FCB3DC4CDB9E");

            entity.ToTable("Aluno");

            entity.HasIndex(e => e.Matricula, "UQ__Aluno__0FB9FB4F7AC7A41E").IsUnique();

            entity.Property(e => e.Matricula)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(120)
                .IsUnicode(false);

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.Alunos)
                .HasForeignKey(d => d.IdTurma)
                .HasConstraintName("FK__Aluno__IdTurma__534D60F1");
        });

        modelBuilder.Entity<HistoricoAtraso>(entity =>
        {
            entity.HasKey(e => e.IdHistorico).HasName("PK__Historic__9CC7EBF3DD27C083");

            entity.ToTable("HistoricoAtraso");
        });

        modelBuilder.Entity<HorarioTurma>(entity =>
        {
            entity.HasKey(e => e.IdHorario).HasName("PK__HorarioT__1539229B67731C41");

            entity.ToTable("HorarioTurma");

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.HorarioTurmas)
                .HasForeignKey(d => d.IdTurma)
                .HasConstraintName("FK__HorarioTu__IdTur__5629CD9C");
        });

        modelBuilder.Entity<ModeloEnsino>(entity =>
        {
            entity.HasKey(e => e.IdModelo).HasName("PK__ModeloEn__CC30D30C840C2FEA");

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
            entity.HasKey(e => e.IdPerfil).HasName("PK__PerfilAc__C7BD5CC14515C49D");

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
            entity.HasKey(e => e.IdPeriodo).HasName("PK__Periodo__B44699FEB6DC68CE");

            entity.ToTable("Periodo");

            entity.Property(e => e.Nome)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Qrcode>(entity =>
        {
            entity.HasKey(e => e.IdQr).HasName("PK__QRCode__B77022C2F46E69CB");

            entity.ToTable("QRCode");

            entity.HasIndex(e => e.TokenHash, "UQ__QRCode__BCB33F92D44C7DE3").IsUnique();

            entity.Property(e => e.IdQr).HasColumnName("IdQR");
            entity.Property(e => e.Ativo).HasDefaultValue(true);
            entity.Property(e => e.ExpiraEm).HasColumnType("datetime");
            entity.Property(e => e.GeradoEm)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TokenHash)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdTurmaNavigation).WithMany(p => p.Qrcodes)
                .HasForeignKey(d => d.IdTurma)
                .HasConstraintName("FK__QRCode__IdTurma__619B8048");
        });

        modelBuilder.Entity<Turma>(entity =>
        {
            entity.HasKey(e => e.IdTurma).HasName("PK__Turma__C1ECFFC996B336E4");

            entity.ToTable("Turma");

            entity.Property(e => e.Nome)
                .HasMaxLength(80)
                .IsUnicode(false);

            entity.HasOne(d => d.IdModeloNavigation).WithMany(p => p.Turmas)
                .HasForeignKey(d => d.IdModelo)
                .HasConstraintName("FK__Turma__IdModelo__4E88ABD4");

            entity.HasOne(d => d.IdPeriodoNavigation).WithMany(p => p.Turmas)
                .HasForeignKey(d => d.IdPeriodo)
                .HasConstraintName("FK__Turma__IdPeriodo__4F7CD00D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
