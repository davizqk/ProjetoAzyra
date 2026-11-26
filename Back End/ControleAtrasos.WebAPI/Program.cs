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

// Comandos locais de manutencao: executados no terminal, nunca via HTTP.
// O operador precisa ter acesso ao banco e as chaves de configuracao da aplicacao.
if (args.Contains("--verificar-banco", StringComparer.OrdinalIgnoreCase) ||
    args.Contains("--seed-admin", StringComparer.OrdinalIgnoreCase))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!await db.Database.CanConnectAsync())
    {
        Console.Error.WriteLine("ERRO: a API nao consegue conectar ao SQL Server configurado em ConnectionStrings:Default.");
        Console.Error.WriteLine("Confirme servidor/porta, firewall, banco ControleAtrasos, credenciais e User Secrets.");
        Environment.ExitCode = 2;
        return;
    }
    if (args.Contains("--verificar-banco", StringComparer.OrdinalIgnoreCase))
    {
        try
        {
            var papelAdminExiste = await db.Papeis.AnyAsync(p => p.Nome == "ADMIN");
            var usuarios = await db.Usuarios.CountAsync();
            var administradoresAtivos = await (
                from u in db.Usuarios
                join up in db.UsuarioPapeis on u.IdUsuario equals up.IdUsuario
                join p in db.Papeis on up.IdPapel equals p.IdPapel
                where u.Ativo && p.Nome == "ADMIN"
                select u.IdUsuario).Distinct().CountAsync();
            Console.WriteLine($"Servidor SQL: {db.Database.GetDbConnection().DataSource}");
            Console.WriteLine($"Banco acessivel: {db.Database.GetDbConnection().Database}");
            if (db.Database.GetDbConnection().DataSource.Contains("localhost", StringComparison.OrdinalIgnoreCase) ||
                db.Database.GetDbConnection().DataSource.Contains("localdb", StringComparison.OrdinalIgnoreCase))
                Console.WriteLine("AVISO: esta instancia e local; configure o servidor central nos computadores da equipe.");
            Console.WriteLine($"Papel ADMIN: {(papelAdminExiste ? "encontrado" : "ausente")}");
            Console.WriteLine($"Usuarios cadastrados: {usuarios}");
            Console.WriteLine($"Administradores ativos: {administradoresAtivos}");
            if (!papelAdminExiste)
                Console.WriteLine("Execute sql/seed-referencias.sql no banco correto, depois tente novamente.");
        }
        catch (Microsoft.Data.SqlClient.SqlException)
        {
            Console.Error.WriteLine("Conexao estabelecida, mas as tabelas necessarias nao foram encontradas ou nao ha permissao para consultar.");
            Environment.ExitCode = 3;
        }
        return;
    }

    if (!app.Environment.IsDevelopment())
    {
        Console.Error.WriteLine("Bootstrap inicial permitido apenas em ambiente Development e sob controle do administrador do banco.");
        Environment.ExitCode = 9;
        return;
    }

    // Primeira conta ADMIN: permitido mesmo se houver usuarios comuns, mas NUNCA
    // quando ja existe um administrador ativo. Nao altera senhas de contas existentes.
    var email = Environment.GetEnvironmentVariable("CONTROLE_ADMIN_EMAIL")?.Trim().ToLowerInvariant();
    var senha = Environment.GetEnvironmentVariable("CONTROLE_ADMIN_PASSWORD");
    if (string.IsNullOrWhiteSpace(email) || !email.Contains('@') ||
        string.IsNullOrWhiteSpace(senha) || senha.Length < 8)
    {
        Console.Error.WriteLine("Defina CONTROLE_ADMIN_EMAIL e CONTROLE_ADMIN_PASSWORD (senha com 8+ caracteres).");
        Environment.ExitCode = 4;
        return;
    }
    try
    {
        await using var tx = await db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        var papel = await db.Papeis.SingleOrDefaultAsync(p => p.Nome == "ADMIN");
        if (papel is null)
        {
            Console.Error.WriteLine("O papel ADMIN nao existe. Execute sql/seed-referencias.sql e repita.");
            Environment.ExitCode = 5;
            return;
        }
        var jaHaAdmin = await (from up in db.UsuarioPapeis
                              join u in db.Usuarios on up.IdUsuario equals u.IdUsuario
                              where up.IdPapel == papel.IdPapel && u.Ativo
                              select u.IdUsuario).AnyAsync();
        if (jaHaAdmin)
        {
            Console.Error.WriteLine("Ja existe um ADMIN ativo. Entre com ele e cadastre outros em POST /api/admin/funcionarios.");
            Environment.ExitCode = 6;
            return;
        }
        if (await db.Usuarios.AnyAsync(u => u.Email == email))
        {
            Console.Error.WriteLine("Este e-mail ja existe. Escolha outro e-mail; o bootstrap nao modifica contas anteriores.");
            Environment.ExitCode = 7;
            return;
        }
        var usuario = new Usuario
        {
            Nome = "Administrador",
            Email = email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha),
            Ativo = true,
            DataCriacao = DateTime.Now
        };
        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        db.Funcionarios.Add(new Funcionario { IdUsuario = usuario.IdUsuario });
        db.UsuarioPapeis.Add(new UsuarioPapel { IdUsuario = usuario.IdUsuario, IdPapel = papel.IdPapel });
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        Console.WriteLine("ADMIN inicial cadastrado com sucesso. Execute a API normalmente e faca login no Swagger.");
    }
    catch (Microsoft.Data.SqlClient.SqlException)
    {
        Console.Error.WriteLine("Falha SQL ao cadastrar ADMIN. Confira as tabelas, permissoes INSERT e o banco conectado.");
        Environment.ExitCode = 8;
    }
    return;
}
app.Run();
