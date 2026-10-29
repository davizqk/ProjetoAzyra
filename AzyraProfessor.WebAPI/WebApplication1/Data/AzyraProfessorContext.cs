using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data;

public partial class AzyraProfessorContext : DbContext
{
    public AzyraProfessorContext(DbContextOptions<AzyraProfessorContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Aluno> Alunos { get; set; }

    public virtual DbSet<HistoricoAtraso> HistoricoAtrasos { get; set; }

    public virtual DbSet<Professor> Professors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.HasKey(e => e.IdAluno).HasName("PK__Aluno__8092FCB36AFD9895");

            entity.ToTable("Aluno");

            entity.HasIndex(e => e.Matricula, "UQ__Aluno__0FB9FB4F85B09757").IsUnique();

            entity.Property(e => e.Matricula)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Turma)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<HistoricoAtraso>(entity =>
        {
            entity.HasKey(e => e.IdHistorico).HasName("PK__Historic__9CC7EBF351158468");

            entity.ToTable("HistoricoAtraso");

            entity.Property(e => e.DataAtraso).HasColumnType("datetime");
            entity.Property(e => e.Justificativa)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.HistoricoAtrasos)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Historico__IdAlu__628FA481");
        });

        modelBuilder.Entity<Professor>(entity =>
        {
            entity.HasKey(e => e.IdProfessor).HasName("PK__Professo__9D84BE1B93C6741B");

            entity.ToTable("Professor");

            entity.HasIndex(e => e.Email, "UQ__Professo__A9D1053459E75651").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Nome)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Senha)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
