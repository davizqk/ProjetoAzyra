using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("Azyra")
    ?? throw new InvalidOperationException("A connection string named 'Azyra' was not found.");

builder.Services.AddDbContext<AzyraContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IModeloEnsinoRepository, ModeloEnsinoRepository>();
builder.Services.AddScoped<IPeriodoRepository, PeriodoRepository>();
builder.Services.AddScoped<ITurmaRepository, TurmaRepository>();
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>();
builder.Services.AddScoped<IHorarioTurmaRepository, HorarioTurmaRepository>();
builder.Services.AddScoped<IHistoricoAtrasoRepository, HistoricoAtrasoRepository>();
builder.Services.AddScoped<IAlertaRecorrenciaRepository, AlertaRecorrenciaRepository>();
builder.Services.AddScoped<IQRCodeRepository, QRCodeRepository>();
builder.Services.AddScoped<IPerfilAcessoRepository, PerfilAcessoRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
