# Azyra.WebAPI — .NET 10

WebAPI CRUD para as nove tabelas do DDL Azyra, organizada em Controllers, DTOs, Interfaces, Repositories, Models e Data.

## Antes de executar

1. Instale o .NET 10 SDK e uma versão do Visual Studio que dê suporte a .NET 10.
2. Confirme que o banco `Azyra` existe no `(localdb)\MSSQLLocalDB` e que as nove tabelas foram criadas a partir do DDL.
3. Abra `Azyra.WebAPI.csproj` no Visual Studio.
4. Abra Tools > NuGet Package Manager > Package Manager Console.
5. Selecione `Azyra.WebAPI` como Default project.

## Scaffold (opcional, para regenerar Models e Context a partir do banco)

Faça backup das pastas `Models` e `Data` antes de usar `-Force`. Rode no Console do Gerenciador de Pacotes:

```powershell
Scaffold-DbContext "Server=(localdb)\MSSQLLocalDB;Database=Azyra;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -ContextDir Data -Context AzyraContext -Namespace Azyra.WebAPI.Models -ContextNamespace Azyra.WebAPI.Data -NoOnConfiguring -Force -Tables ModeloEnsino,Periodo,Turma,Aluno,HorarioTurma,HistoricoAtraso,AlertaRecorrencia,QRCode,PerfilAcesso
```

O projeto já contém Models e `AzyraContext` com as colunas e relações do DDL, então o Scaffold não é obrigatório para começar. Os repositórios usam `context.Set<TEntity>()` e não dependem de nomes específicos de propriedades DbSet, reduzindo incompatibilidades de pluralização.

## Executar

- No Visual Studio, restaurar pacotes NuGet, compilar (`Ctrl+Shift+B`) e iniciar (`F5`).
- Swagger: URL de inicialização `/swagger`.
- A connection string está em `appsettings.json`. Ajuste-a se a instância ou banco forem diferentes.

## Rotas

Cada recurso tem `GET /api/{Recurso}`, `GET /api/{Recurso}/{id}`, `POST /api/{Recurso}`, `PUT /api/{Recurso}/{id}` e `DELETE /api/{Recurso}/{id}`.

Recursos: `ModeloEnsino`, `Periodo`, `Turma`, `Aluno`, `HorarioTurma`, `HistoricoAtraso`, `AlertaRecorrencia`, `QRCode`, `PerfilAcesso`.

## Observações

- O CRUD respeita as chaves estrangeiras no SQL Server; se tentar apagar uma entidade referenciada, o banco poderá rejeitar a operação (erro de integridade referencial).
- O `HistoricoAtraso.Data` é representado como `DateTime` no C#, padrão do provider SQL Server para coluna `date`.
- `GeradoEm` e `Ativo` de QRCode usam defaults na API se não forem enviados.
- Este projeto não inclui autenticação/autorização. Não exponha endpoints publicamente sem adicionar esses controles.
- O código foi gerado para corresponder ao DDL fornecido. Não foi possível compilar neste ambiente porque o SDK .NET não está instalado; compile no Visual Studio para validação final.
