using System.Text;
using System.Threading.RateLimiting;
using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Middleware;
using ControleAtrasos.Api.Models;
using ControleAtrasos.Api.Repositories;
using ControleAtrasos.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"];
var cpfKey = builder.Configuration["Security:CpfHmacKey"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32 ||
    string.IsNullOrWhiteSpace(cpfKey) || Encoding.UTF8.GetByteCount(cpfKey) < 32)
    throw new InvalidOperationException(
        "Configure Jwt:Key e Security:CpfHmacKey com 32+ bytes cada. Rode scripts/configurar-dev.ps1 no PowerShell.");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.AddSecurityDefinition("bearer", new OpenApiSecurityScheme {
        Type = SecuritySchemeType.Http, Scheme = "bearer", BearerFormat = "JWT",
        Description = "Insira o token JWT gerado por /api/auth/login."
    });
    o.AddSecurityRequirement(doc => new OpenApiSecurityRequirement {
        [new OpenApiSecuritySchemeReference("bearer", doc)] = []
    });
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("Default")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.FromSeconds(30)
    };
});
builder.Services.AddAuthorization(o => {
    o.AddPolicy("ProfessorOuGestao", p => p.RequireRole("PROFESSOR", "AQV", "COORDENACAO", "ADMIN"));
    o.AddPolicy("Gestao", p => p.RequireRole("AQV", "COORDENACAO", "ADMIN"));
    o.AddPolicy("Admin", p => p.RequireRole("ADMIN"));
});

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>();
builder.Services.AddScoped<IRegistroRepository, RegistroRepository>();
builder.Services.AddScoped<IRecorrenciaRepository, RecorrenciaRepository>();
builder.Services.AddScoped<IConsultasRepository, ConsultasRepository>();
builder.Services.AddScoped<ICadastroRepository, CadastroRepository>();
builder.Services.AddScoped<ISegurancaService, SegurancaService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRegistroService, RegistroService>();
builder.Services.AddScoped<IRecorrenciaService, RecorrenciaService>();
builder.Services.AddScoped<IAdministracaoService, AdministracaoService>();

var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
    p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddRateLimiter(o => {
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("registro", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
        _ => new FixedWindowRateLimiterOptions {
            PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0
        }));
});

var app = builder.Build();
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
} else {
    app.UseHttpsRedirection();
}
app.UseMiddleware<TratamentoErrosMiddleware>();
app.UseRouting();
app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Cria o administrador inicial uma unica vez, usando variaveis de ambiente, sem senha no codigo.
if (args.Contains("--seed-admin"))
{
    var email = Environment.GetEnvironmentVariable("CONTROLE_ADMIN_EMAIL")?.Trim().ToLowerInvariant();
    var senha = Environment.GetEnvironmentVariable("CONTROLE_ADMIN_PASSWORD");
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha) || senha.Length < 12)
        throw new InvalidOperationException("Defina CONTROLE_ADMIN_EMAIL e CONTROLE_ADMIN_PASSWORD (12+ caracteres).");
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (await db.Usuarios.AnyAsync())
        throw new InvalidOperationException("Bootstrap bloqueado: ja existem usuarios cadastrados.");
    var papel = await db.Papeis.SingleAsync(p => p.Nome == "ADMIN");
    var usuario = new Usuario { Nome = "Administrador", Email = email,
        SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha), Ativo = true, DataCriacao = DateTime.Now };
    await using var transacao = await db.Database.BeginTransactionAsync();
    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    db.Funcionarios.Add(new Funcionario { IdUsuario = usuario.IdUsuario });
    db.UsuarioPapeis.Add(new UsuarioPapel { IdUsuario = usuario.IdUsuario, IdPapel = papel.IdPapel });
    await db.SaveChangesAsync();
    await transacao.CommitAsync();
    Console.WriteLine("Administrador inicial cadastrado. Remova as variaveis de ambiente e execute novamente sem --seed-admin.");
    return;
}
app.Run();
