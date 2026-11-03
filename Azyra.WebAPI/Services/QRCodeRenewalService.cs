using System.Security.Cryptography;
using Azyra.WebAPI.Data;
using Azyra.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Services;

/// <summary>
/// Gera um novo token para cada turma a cada cinco minutos e desativa os tokens anteriores.
/// O primeiro ciclo é executado assim que a API inicia.
/// </summary>
public sealed class QRCodeRenewalService : BackgroundService
{
    private static readonly TimeSpan RenewalInterval = TimeSpan.FromMinutes(5);
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<QRCodeRenewalService> _logger;

    public QRCodeRenewalService(
        IServiceScopeFactory scopeFactory,
        ILogger<QRCodeRenewalService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await RenewAllAsync(stoppingToken);

        using var timer = new PeriodicTimer(RenewalInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await RenewAllAsync(stoppingToken);
        }
    }

    private async Task RenewAllAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AzyraContext>();
            var now = DateTime.Now;
            var turmas = await db.Turma.AsNoTracking()
                .Select(t => t.IdTurma)
                .ToListAsync(cancellationToken);

            if (turmas.Count == 0)
                return;

            var ativos = await db.QRCode
                .Where(q => q.Ativo)
                .ToListAsync(cancellationToken);

            foreach (var qr in ativos)
                qr.Ativo = false;

            foreach (var idTurma in turmas)
            {
                db.QRCode.Add(new QRCode
                {
                    IdTurma = idTurma,
                    TokenHash = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)),
                    GeradoEm = now,
                    ExpiraEm = now.Add(RenewalInterval),
                    Ativo = true
                });
            }

            await db.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("QR Codes renovados para {Quantidade} turmas.", turmas.Count);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // Encerramento normal da aplicação.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Falha ao renovar os QR Codes.");
        }
    }
}
