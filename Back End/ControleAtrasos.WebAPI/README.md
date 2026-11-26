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

O banco deve ter as tabelas e o papel `ADMIN`, mas **nenhum administrador ativo**. A existência de professores e outros usuários não bloqueia a criação do primeiro ADMIN.
No PowerShell, dentro da pasta do projeto:

```powershell
$env:CONTROLE_ADMIN_EMAIL = 'admin@teste.local'
$env:CONTROLE_ADMIN_PASSWORD = 'ESCOLHA_UMA_SENHA_FORTE_COM_8+_CARACTERES'
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
| GET,POST | `/api/admin/horarios` | Admin |
| PUT,DELETE | `/api/admin/horarios/{id}` | Admin |
| GET | `/api/admin/calendario?ano=2026` | Admin |
| POST | `/api/admin/calendario/gerar` | Admin |
| PUT | `/api/admin/calendario/reconfigurar` | Admin |
| PUT, DELETE | `/api/admin/calendario/{data}` | Admin |
| DELETE | `/api/admin/calendario/ano/{ano}?confirmar=true` | Admin |
| GET | `/api/admin/modelos`, `/api/admin/periodos` | Admin |

**Datas** em ISO (`2026-11-12`), **horários** no formato de TimeSpan (`"07:30:00"`).
Filtros de listagem: `inicio`, `fim`, `pagina`, `tamanho`, `turmaId` conforme Swagger.

## Regras de negócio

- **Comunidade:** alerta após 3 atrasos em dias letivos consecutivos.
- **SEDUC:** alerta após 2 atrasos em dias letivos consecutivos.
- Usa o calendário `CalendarioLetivo`, as exceções da turma e os horários vigentes para determinar a sequência. Dias sem aula para aquela turma não interrompem os atrasos consecutivos.
- Ocorre **no registro confirmado**, na mesma transação SQL. Mudanças retroativas no calendário, nas exceções ou no horário não geram reprocessamento automático de alertas já registrados.
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

---

## CORRECOES DE 17/11/2026 (projeto auditado)

### 1. Testar o banco de dados ANTES do cadastro de administrador

A connection string em `appsettings.json` usa `localhost` apenas como **valor de exemplo**.
Em equipe com banco compartilhado, cada computador deve configurar a instancia SQL real em **User Secrets**.
Execute **uma vez por PC**:

```powershell
.\scripts\configurar-banco-compartilhado.ps1
.\scripts\verificar-banco.ps1
```

O script pergunta servidor (como `tcp:192.168.1.50,51433`), banco, login e senha SQL.
O segundo imprime se o banco está acessivel, quantos usuarios e quantos ADMIN ativos existem.
Nao e preciso rodar Scaffold nem recriar o banco.

O usuario SQL de conexao (`controle_api`) **nao e um administrador da aplicacao**.
Para criar contas da API, use o proximo passo.

### 2. Garantir que existe o papel ADMIN, sem apagar dados

Se o comando de verificacao indicar `Papel ADMIN: ausente`, execute
`sql/seed-referencias.sql` no SSMS **conectado ao banco correto**.
Esse script nao apaga tabelas nem cadastros e inclui os quatro periodos
`Manha`, `Tarde`, `Noite` e `Integral` quando ausentes.

### 3. Criar o PRIMEIRO administrador (mesmo havendo alunos e funcionarios)

**Execute apenas no computador autorizado a administrar a base, usando um terminal confiavel.**
O comando foi corrigido: ele bloqueia o bootstrap somente se **ja existir um ADMIN ativo**, 
nao se existirem usuarios comuns.

```powershell
.\scripts\criar-admin.ps1
```

Serao pedidos o e-mail e uma senha com no minimo 8 caracteres (digitada de modo oculto).
O script executa `dotnet run -- --seed-admin`, sem gravar senha no projeto.
Se ja existir um ADMIN ativo, ele informa a situacao e NAO altera esse usuario.
Se o e-mail ja estiver cadastrado, escolha outro; o bootstrap nao muda o papel de uma conta existente.

### 4. Testar o login no Swagger

Execute `dotnet run` e abra o endereco `/swagger` apresentado no terminal.
No POST `/api/auth/login`, envie por exemplo:

```json
{ "email": "SEU_EMAIL_ADMIN", "senha": "SUA_SENHA_ADMIN" }
```

Se a resposta for `200 OK`, copie o token JWT, clique em **Authorize** no Swagger,
cole so o token (sem aspas e sem escrever `Bearer`) e execute `GET /api/admin/periodos`.

### 5. Criar novos ADMIN depois do primeiro

Use `POST /api/admin/funcionarios` autenticado com um ADMIN existente:

```json
{
  "nome": "Administrador 2",
  "email": "outro-admin@teste.local",
  "senha": "SENHA_FORTE_UNICA_AQUI",
  "papeis": ["ADMIN"],
  "codigoFuncionario": "ADM002"
}
```

### 6. Cuidado com as chaves da equipe

O `Security:CpfHmacKey` **tem de ser o mesmo em todas as instancias** que consultam
alunos no banco compartilhado. O script `configurar-dev.ps1` agora nao substitui
chaves que ja estejam armazenadas em User Secrets, para evitar perda de compatibilidade.
Nunca envie chaves nem credenciais no Git, ZIP ou capturas de tela. Distribua-as por canal seguro.

Para producao, prefira **uma unica instancia de API compartilhada**, HTTPS valido,
controle de permissao e backups. `TrustServerCertificate=True` no script e apenas
para testes em rede de desenvolvimento confiavel.

### Limites da revisao

O arquivo foi revisado estaticamente. Nao foi possivel executar `dotnet build` e
validar SQL Server no ambiente de geracao, pois o SDK .NET nao esta disponivel aqui.
Execute `dotnet restore`, `dotnet build` e depois os scripts em um computador com .NET 10 e acesso autorizado ao banco.


---

## ATUALIZAÇÃO: CALENDÁRIO EFETIVO POR TURMA (17/11/2026)

**OBRIGATÓRIO PARA BANCO JÁ EXISTENTE:** no SSMS, conectado ao banco compartilhado,
execute somente `sql/upgrade-excecoes-calendario-turma.sql`. Ele cria a tabela
`ExcecoesCalendarioTurma` e **não remove nem altera os dados já cadastrados**.
Não execute `schema.sql` em um banco existente. Para banco vazio, o `schema.sql`
já inclui a nova tabela.

A API agora entende:

- Calendário geral (`CalendarioLetivo`): feriados, recessos e datas letivas.
- Horários de cada turma (`HorariosTurmas`): por exemplo, terça (2) e quinta (4).
- Exceções por turma (`ExcecoesCalendarioTurma`): cancelamento ou reposição
  de aula em uma data específica (tem prioridade sobre o calendário geral).
- Um dia somente conta como dia de aula quando o calendário permitir **e** existir
  um horário vigente naquela turma/dia. Uma exceção de reposição também precisa
  de um horário específico (cadastrado em `HorariosTurmas`).
- Recorrência Comunidade: 3 atrasos em **dias de aula consecutivos da mesma turma**.
- Recorrência SEDUC: 2 atrasos em **dias de aula consecutivos da mesma turma**.
- A mesma sequência prolongada gera **um alerta** ao atingir o limite da regra,
  sem repetir alerta nos dias seguintes até que uma nova sequência se forme.

### 1. Gerar calendário geral do período sem cadastrar todos os dias manualmente

Como ADMIN autenticado no Swagger:

`POST /api/admin/calendario/gerar`

```json
{
  "inicio": "2026-11-01",
  "fim": "2026-12-18",
  "diasSemanaLetivos": [1, 2, 3, 4, 5]
}
```

O endpoint cria os dias úteis como letivos e os demais como não letivos **somente
para datas ainda não cadastradas**. A resposta informa quantos dias foram
inseridos. **Revise feriados e recessos** e use
`PUT /api/admin/calendario/{data}` para corrigir datas, conforme o calendário
real da escola. Também fornecemos `sql/gerar-calendario-letivo-periodo.sql`
para cadastro inicial por SQL.

### 2. Turma que só tem aulas terça e quinta

Cadastre duas entradas em `POST /api/admin/horarios` para a mesma turma,
uma `diaSemana: 2` (terça) e outra `diaSemana: 4` (quinta).
Em ambas, defina `vigenciaInicio` no início do período e `vigenciaFim`
como `null` ou a data de término. NÃO cadastre horários para os demais dias.

**Exemplo:** atrasos nos dias 17/11 (terça) e 19/11 (quinta) são consecutivos
para esta turma; 18/11 (quarta) não interfere, pois a turma não tem aula.
O próximo dia efetivo é terça 24/11. Na SEDUC o alerta surge no segundo
atraso (19/11); na Comunidade, no terceiro (24/11), se todos forem registrados.

### 3. Cancelamento de uma aula de uma turma

`PUT /api/admin/turmas/1/excecoes-calendario/2026-11-19`

```json
{ "temAula": false, "motivo": "Aula cancelada" }
```

Esse dia deixa de contar para **essa turma**, sem alterar o calendário geral
nem os horários das outras turmas. Outras turmas continuam funcionando.

### 4. Reposição de aula em um sábado ou feriado

1. Cadastre um **horário válido somente nessa data** em `POST /api/admin/horarios`:

```json
{
  "idTurma": 1,
  "diaSemana": 6,
  "horarioEntrada": "08:00:00",
  "toleranciaMinutos": 10,
  "vigenciaInicio": "2026-11-21",
  "vigenciaFim": "2026-11-21"
}
```

2. Marque a exceção da turma:

`PUT /api/admin/turmas/1/excecoes-calendario/2026-11-21`

```json
{ "temAula": true, "motivo": "Reposição de aula" }
```

A exceção permite esse dia mesmo se o calendário geral indicar não letivo;
a API ainda exige um horário ativo correspondente.

### 5. Listar e remover exceções

- `GET /api/admin/turmas/1/excecoes-calendario?inicio=2026-11-01&fim=2026-11-30`
- `DELETE /api/admin/turmas/1/excecoes-calendario/2026-11-21`

**Exceções só alteram regras de datas; não apagam atrasos já registrados.**
Se mudar um calendário retroativamente, alertas já gerados não são
recalculados automaticamente. Para histórico alterado, faça reprocessamento
controlado antes de usar indicadores oficiais.

### Testes essenciais

1. Cadastre calendário geral de uma semana e horários de terça/quinta.
2. Na quarta-feira, a identificação do aluno da turma deve ser recusada.
3. Na terça ou quinta-feira, após a tolerância, deve ser permitida.
4. Faça uma exceção `temAula:false` para uma quinta: a identificação deve ser recusada.
5. Uma reposição `temAula:true` sem horário não deve registrar atraso;
   ao criar o horário de reposição, poderá registrar.
6. Verifique alertas com dois atrasos consecutivos (SEDUC) ou três (Comunidade),
   considerando somente os dias efetivos da turma.

**ATENÇÃO:** os registros de atraso da API usam a data/hora real do servidor,
portanto os testes de sequência com datas futuras exigem esperar as datas
correspondentes ou usar um ambiente de integração com relógio controlado.
Esta entrega não altera o relógio nem insere atrasos retroativos.

O projeto foi revisado estaticamente; compile e teste com .NET 10 e SQL Server
antes de utilizá-lo com dados reais.


## Gerenciamento administrativo do calendário

Consulte [GERENCIAMENTO-CALENDARIO.md](GERENCIAMENTO-CALENDARIO.md) para corrigir, consultar e excluir datas pelo Swagger, sem alteração no schema do banco.


## Cadastro de alunos sem número de matrícula

O `POST /api/admin/alunos` recebe apenas `nome` e `cpf`. O número de matrícula não aparece mais nas respostas de cadastro, edição, listagem de alunos ou consultas de atrasos. O CPF continua sendo validado e verificado quanto a duplicidade, inclusive para alunos inativos. A coluna legada `Alunos.Matricula` permanece no banco: para novos alunos, a API gera automaticamente um código interno `AUTO-` seguido de um GUID. Nenhuma alteração de DDL, scaffold ou migração é necessária. O endpoint `/api/admin/matriculas` permanece para vincular o aluno à turma, com vigência, e não solicita número de matrícula. Consulte `ALTERACAO-MATRICULA.md` para os testes.


## Remoção de dias do calendário

Veja [REMOCAO-DIAS-CALENDARIO.md](REMOCAO-DIAS-CALENDARIO.md) para reconfigurar e excluir datas não selecionadas sem modificar o histórico protegido.
