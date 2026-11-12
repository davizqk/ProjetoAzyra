using ControleAtrasos.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Middleware;

public sealed class TratamentoErrosMiddleware(RequestDelegate next, ILogger<TratamentoErrosMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try { await next(context); }
        catch (RegraNegocioException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = ex.StatusCode, Title = "Requisição não atendida", Detail = ex.Message
            });
        }
        catch (DbUpdateException ex)
        {
            logger.LogError(ex, "Falha ao salvar no banco");
            context.Response.StatusCode = StatusCodes.Status409Conflict;
            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = 409, Title = "Conflito ao persistir dados",
                Detail = "Os dados podem estar duplicados ou violar uma regra do banco."
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Falha inesperada da API");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = 500, Title = "Erro interno", Detail = "Consulte os logs do servidor."
            });
        }
    }
}
