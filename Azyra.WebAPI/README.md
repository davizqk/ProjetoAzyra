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
- O `HistoricoAtraso.Data` armazena data e hora (`datetime2`); `HoraChegada` armazena a hora separadamente (`time`).
- `GeradoEm` e `Ativo` de QRCode usam defaults na API se não forem enviados.
- Este projeto não inclui autenticação/autorização. Não exponha endpoints publicamente sem adicionar esses controles.
- O código foi gerado para corresponder ao DDL fornecido. Não foi possível compilar neste ambiente porque o SDK .NET não está instalado; compile no Visual Studio para validação final.

## Alterações para registro automático de atrasos

Antes de executar a versão atualizada, faça backup do banco e execute `Database/AtualizarBanco.sql` no SQL Server. O script adiciona CPF ao aluno e HoraChegada ao histórico, aproveita a hora já existente em `Data` quando disponível e altera `HistoricoAtraso.Data` para `datetime2`. Cadastre o CPF real de cada aluno; registros antigos sem CPF não poderão ser encontrados por CPF até serem atualizados.

### Registrar chegada

`POST /api/HistoricoAtraso`

```json
{
  "cpf": "12345678901"
}
```

A API usa a data/hora atual do servidor. Para testes, pode-se enviar `dataHoraChegada` em ISO 8601. A API procura o aluno pelo CPF, identifica o horário da turma para o dia da semana, aplica a tolerância e calcula `Atrasado`; o cliente não envia esse campo. O histórico retorna também `NomeAluno` e `NomeTurma`.

### Consultar recorrências

`GET /api/AlertaRecorrencia/recorrencias` retorna alunos com pelo menos 3 atrasos registrados. O limite pode ser alterado, por exemplo: `GET /api/AlertaRecorrencia/recorrencias?minimo=5`.

**Importante:** o ZIP contém somente a API .NET, não contém os arquivos `telaAtraso.jsx` e `Recorrencias.jsx`. Portanto, o POST da tela de chegada e a substituição dos dados fictícios na interface ainda precisam ser implementados no projeto Front-End. O horário usa o relógio local do servidor; mantenha o servidor configurado no fuso horário esperado.


## QR Code com renovação automática

- `QRCodeRenewalService` cria um token novo para cada turma ao iniciar a API e renova todos a cada 5 minutos.
- A renovação desativa os QR Codes anteriores e grava `GeradoEm` e `ExpiraEm`.
- Consulte `GET /api/QRCode/ativo/{idTurma}` para obter o QR Code vigente da turma. A tela deve consultar essa rota periodicamente e renderizar o conteúdo recebido como QR Code.
- O token retornado é um valor aleatório de uso temporário. A API ainda precisa validar esse token no endpoint de registro de presença antes de aceitar uma chegada por QR Code; o POST atual de `HistoricoAtraso` identifica pelo CPF e não recebe token QR.
- O serviço renova os QR Codes de todas as turmas cadastradas, independentemente do horário de aula.

## Swagger

O documento está registrado como `v1` com título e versão, e a interface aponta explicitamente para `/swagger/v1/swagger.json`. Em Development, acesse `/swagger`.

## Limites desta entrega

Este ZIP contém a API .NET. Não contém o front-end React (`telaAtraso.jsx` e `Recorrencias.jsx`), portanto a integração visual e a atualização periódica do QR Code na tela precisam ser feitas no projeto front-end. O código não foi compilado neste ambiente; valide com `dotnet restore` e `dotnet build` no Visual Studio ou terminal com o SDK .NET 10 instalado.
