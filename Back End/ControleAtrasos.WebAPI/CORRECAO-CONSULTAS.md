# Correção das consultas paginadas

- Arquivo alterado: Repositories/ConsultasRepository.cs.
- Ordenação e paginação sobre as colunas mapeadas, antes de construir os DTOs.
- Afeta consultas de atrasos da gestão e das turmas, e consulta de alertas.
- Mantém filtros, contagem total, contrato JSON e regras de autorização.
- Não requer alteração no banco nem scaffold.

## Validação local
Execute dotnet build e teste no Swagger GET /api/gestao/atrasos?pagina=1&tamanho=50 e GET /api/gestao/alertas?pagina=1&tamanho=50. Teste também a consulta de atrasos da turma como professor autorizado. Confira páginas vazias, filtros e ordenação mais recente primeiro.

A correção foi revisada estaticamente; não foi compilada nem testada com SQL Server no ambiente de edição.
