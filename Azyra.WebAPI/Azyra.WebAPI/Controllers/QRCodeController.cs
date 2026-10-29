using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.QRCode;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QRCodeController : ControllerBase
{
    private readonly IQRCodeRepository _repository;
    public QRCodeController(IQRCodeRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<QRCodeResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<QRCodeResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<QRCodeResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<QRCodeResponseDTO>> Create([FromBody] QRCodeRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdQr;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QRCodeRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdQr = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static QRCode ToEntity(QRCodeRequestDTO dto) => new()
    {
        IdTurma = dto.IdTurma,
        TokenHash = dto.TokenHash,
        GeradoEm = dto.GeradoEm ?? DateTime.UtcNow,
        ExpiraEm = dto.ExpiraEm,
        Ativo = dto.Ativo ?? true,
    };

    private static QRCodeResponseDTO ToResponse(QRCode entity) => new()
    {
        IdQR = entity.IdQr,
        IdTurma = entity.IdTurma,
        TokenHash = entity.TokenHash,
        GeradoEm = entity.GeradoEm,
        ExpiraEm = entity.ExpiraEm,
        Ativo = entity.Ativo,
    };
}
