using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Route("api/saude")]
public sealed class SaudeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok" });
}
