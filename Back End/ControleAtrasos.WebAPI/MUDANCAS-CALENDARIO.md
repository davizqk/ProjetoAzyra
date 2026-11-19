# Atualização do calendário por turma

Esta entrega parte da última API **ControleAtrasos_WebAPI_NET10_Auditada_Admin**.

## Arquivos alterados

- `Models/ExcecaoCalendarioTurma.cs` (novo)
- `Data/AppDbContext.cs` (mapeamento da tabela)
- `Services/RegrasDiaAula.cs` (regra compartilhada)
- `Repositories/RegistroRepository.cs` e `Interfaces/IRegistroRepository.cs` (validação do dia por turma)
- `Services/RegistroService.cs` (identificação e confirmação)
- `Repositories/RecorrenciaRepository.cs`, `Interfaces/IRecorrenciaRepository.cs`, `Services/RecorrenciaService.cs`
- `Controllers/AdminTurmasController.cs`, `DTO/AdminDtos.cs`, `Services/AdministracaoService.cs`
- `Repositories/CadastroRepository.cs`, `Interfaces/ICadastroRepository.cs`, `Interfaces/IServices.cs`
- `sql/schema.sql` (novos bancos)
- `sql/upgrade-excecoes-calendario-turma.sql` (**executar em banco existente**)
- `sql/gerar-calendario-letivo-periodo.sql` (alternativa inicial por SQL)

## Implantação sem apagar dados

1. Faça backup do banco `ControleAtrasos` existente.
2. Execute **apenas** `sql/upgrade-excecoes-calendario-turma.sql` no SSMS.
3. Substitua os arquivos do projeto pela nova versão e execute `dotnet restore` e `dotnet build`.
4. Preserve os User Secrets (`Jwt:Key`, `Security:CpfHmacKey` e connection string do banco compartilhado).
5. Execute a API, entre no Swagger como ADMIN e teste `POST /api/admin/calendario/gerar`.
6. Cadastre horários por turma e exceções para aulas canceladas e reposições.
7. Teste identificação/confirmacão de atraso e consulte alertas da gestão.

## Importante

- A migração é aditiva; NÃO rode `sql/schema.sql` sobre um banco já existente.
- Não execute `scripts/configurar-dev.ps1` novamente se já existem CPFs registrados.
- Dados existentes, inclusive matrícula e histórico de atrasos, são preservados.
- Reprocessamento de alertas históricos NÃO é automático.
- A compilação não foi executada aqui por falta do SDK .NET no ambiente de geração.
