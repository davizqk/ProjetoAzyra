# Controle de Atrasos — Unidade 1.34 | ASP.NET Core Web API .NET 10

API organizada em camadas, com **Controllers**, **Interfaces**, **Repositories**, **DTO**, **Services**, **Data**, **Models** e **Middleware**. Inclui DDL SQL Server, documentação Swagger com botão **Authorize**, rate limiting e scripts de setup.

## Estrutura

```text
ControleAtrasos.Api/
├── Controllers/        # Endpoints HTTP e autorização
├── DTO/                # Entradas e respostas sem expor entidades sensíveis
├── Interfaces/         # Contratos dos services e repositórios
├── Repositories/       # Consultas e persistência EF Core
├── Services/           # Regras de negócio e validações
├── Models/             # As 16 entidades do DDL
├── Data/               # AppDbContext e mapeamento do SQL Server
├── Middleware/         # Tratamento padronizado de erros
├── Exceptions/         # Exceções de regras de negócio
├── Properties/         # Perfil local de inicialização
├── sql/schema.sql      # Esquema em banco vazio + seeds
├── scripts/            # Configurar chaves e testar saúde
├── examples/requests.http
├── Program.cs          # Apenas configuração, DI e bootstrap
└── ControleAtrasos.Api.csproj
```

## Antes de iniciar

- Instale **.NET 10 SDK**, Visual Studio com suporte ao .NET 10 e SQL Server.
- Confirme que não está rodando a aplicação em banco real com dados sensíveis.
- Banco utilizado: `ControleAtrasos`.
- Execute `sql/schema.sql` **somente em banco vazio**. Não recrie tabelas se você já usou o DDL original.
- O esquema deste ZIP é uma reconstrução compatível com os campos definidos na conversa. **Não foi possível verificar o texto integral do seu DDL original**. Caso o seu SQL esteja diferente, compare antes de iniciar.

## Configuração inicial (evita erro de Jwt:Key / CpfHmacKey)

No PowerShell, dentro da pasta do `.csproj`:

```powershell
dotnet restore
.\scripts\configurar-dev.ps1
```

O script gera chaves **aleatórias** no User Secrets; elas não são gravadas no repositório. Se sua instância for SQL Express:

```powershell
dotnet user-secrets set 'ConnectionStrings:Default' 'Server=.\SQLEXPRESS;Database=ControleAtrasos;Trusted_Connection=True;TrustServerCertificate=True;'
```

Ou, para LocalDB:

```powershell
dotnet user-secrets set 'ConnectionStrings:Default' 'Server=(localdb)\MSSQLLocalDB;Database=ControleAtrasos;Trusted_Connection=True;TrustServerCertificate=True;'
```

**Atenção:** se trocar `Security:CpfHmacKey` após criar alunos, os CPFHash anteriores não serão reconhecidos. Não execute o script novamente nesse caso.

## Criar primeiro administrador

O banco deve ter as tabelas e os seeds (`Papeis`, etc.), mas nenhum usuário.
No PowerShell, dentro da pasta do projeto:

```powershell
$env:CONTROLE_ADMIN_EMAIL = 'admin@teste.local'
$env:CONTROLE_ADMIN_PASSWORD = 'ESCOLHA_UMA_SENHA_FORTE_COM_12+_CARACTERES'
dotnet run -- --seed-admin
Remove-Item Env:CONTROLE_ADMIN_EMAIL
Remove-Item Env:CONTROLE_ADMIN_PASSWORD
```

Após a mensagem de criação, inicie normalmente:

```powershell
dotnet run --urls http://localhost:5080
```

Acesse http://localhost:5080/swagger . O perfil `Properties/launchSettings.json` também abre o Swagger ao executar com F5 no Visual Studio.

## Testar no Swagger

1. `GET /api/saude`: retorna `{ "status": "ok" }`.
2. `POST /api/auth/login`: forneça email e senha do admin.
3. Copie `token` da resposta. Clique em **Authorize** no Swagger e cole o JWT (sem prefixar `Bearer`, se o formulário já acrescentar o esquema).
4. `GET /api/admin/modelos`: se o SQL está acessível, retorna `Comunidade` e `SEDUC`.
5. Cadastre turma, horário, data letiva, aluno e matrícula.
6. Teste `POST /api/registro/identificar` com o CPF válido fictício, depois `POST /api/registro/confirmar` com `tokenConfirmacao`.

O horário da turma deve estar cadastrado para o dia atual e a tolerância deve estar ultrapassada. O token da confirmação expira em 3 minutos.

## Principais endpoints

| Método | Caminho | Acesso |
|--------|---------|--------|
| GET | `/api/saude` | Público |
| POST | `/api/auth/login` | Público |
| POST | `/api/registro/identificar` | Público, limitado por IP |
| POST | `/api/registro/confirmar` | Público, limitado por IP |
| GET | `/api/professor/turmas` | Professor e gestão |
| GET | `/api/turmas/{id}/atrasos` | Professor vinculado ou gestão |
| GET | `/api/gestao/atrasos` | AQV, coordenação, admin |
| GET | `/api/gestao/indicadores` | AQV, coordenação, admin |
| GET | `/api/gestao/alertas` | AQV, coordenação, admin |
| PATCH | `/api/gestao/alertas/{id}` | AQV, coordenação, admin |
| GET,POST,PUT | `/api/admin/alunos` | Admin |
| GET,POST,PUT | `/api/admin/funcionarios` | Admin |
| GET,POST,PUT | `/api/admin/turmas` | Admin |
| GET,POST | `/api/admin/matriculas` | Admin |
| POST | `/api/admin/professor-turmas` | Admin |
| GET,POST,PUT | `/api/admin/horarios` | Admin |
| PUT | `/api/admin/calendario/{data}` | Admin |
| GET | `/api/admin/modelos`, `/api/admin/periodos` | Admin |

**Datas** em ISO (`2026-11-12`), **horários** no formato de TimeSpan (`"07:30:00"`).
Filtros de listagem: `inicio`, `fim`, `pagina`, `tamanho`, `turmaId` conforme Swagger.

## Regras de negócio

- **Comunidade:** alerta após 3 atrasos em dias letivos consecutivos.
- **SEDUC:** alerta após 2 atrasos em dias letivos consecutivos.
- Usa o calendário `CalendarioLetivo` para determinar a sequência, não apenas dias corridos.
- Ocorre **no registro confirmado**, na mesma transação SQL. Mudanças retroativas no calendário ou horário não geram reprocessamento automático.
- Um atraso por matrícula/dia, garantido por índice único no SQL.
- CPF não é salvo em texto: usa HMAC-SHA256 com chave secreta. Senha usa BCrypt.
- Aluno não faz login. Quem estiver no tablet da coordenação informa o CPF e confirma os dados.
- Professor apenas consulta para atualizar manualmente a planilha Excel. O sistema não edita Excel.
- Tratativa AQV completa e front-end **não** estão incluídos.

## Limites importantes

- **Ainda não compilado/testado com SQL Server neste ambiente** por ausência do SDK .NET e do servidor. Faça `dotnet build` e testes reais no Visual Studio antes de integração.
- O endpoint público de CPF pode revelar identificação escolar a quem conheça um CPF: usar tablet supervisionado, rede/IP controlado, logs de auditoria e controles da LGPD antes do uso real.
- A aplicação utiliza `DateTime.Now` do servidor. Configure o fuso local da escola, considerando horário de verão quando aplicável.
- JWT não é revogado imediatamente quando um funcionário é desativado (expira em até 2 horas). Para produção, incluir verificação ativa/revogação.
- Rate limiter por IP é uma proteção básica; adicione controles de dispositivo e auditoria antes de publicar na internet.
- Para eliminar inconsistências de horários simultâneos, evite cadastrar vigências sobrepostas para uma mesma turma/dia.
