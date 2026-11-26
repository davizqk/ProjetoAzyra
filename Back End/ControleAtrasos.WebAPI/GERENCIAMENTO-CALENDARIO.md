# Gerenciamento administrativo do calendário geral

Esta versão foi feita sobre o ZIP `ControleAtrasos.WebAPI(1).zip`.
Não altera o DDL, as tabelas, os horários das turmas, as exceções por turma,
o fluxo de autenticação nem os dados do banco na instalação.

## Instalação

1. Faça backup do banco e do projeto atual. Pare a API antiga.
2. Extraia o ZIP e abra `ControleAtrasos.Api.slnx` no Visual Studio.
3. Se você alterou a conexão em `appsettings.json` após enviar o ZIP, copie
   somente essa configuração local para a nova versão. O UserSecretsId permanece
   igual; preserve `Jwt:Key`, `Security:CpfHmacKey` e a conexão já utilizada.
   Não gere outra chave de CPF e não rode o schema.sql em um banco existente.
4. Execute `dotnet restore`, `dotnet build` e `dotnet run` na pasta do projeto.
5. Abra http://localhost:5080/swagger, faça login como ADMIN e autorize com o JWT.

## Rotas administrativas

| Método | Rota | Resposta de sucesso |
|---|---|---|
| GET | `/api/admin/calendario?ano=2026` | 200, lista de datas cadastradas ordenada |
| POST | `/api/admin/calendario/gerar` | 200, diasInseridos |
| PUT | `/api/admin/calendario/reconfigurar` | 200, resultado da operação |
| PUT | `/api/admin/calendario/2026-11-24` | 204, dia inserido ou editado |
| DELETE | `/api/admin/calendario/2026-11-24` | 204 |
| DELETE | `/api/admin/calendario/ano/2026?confirmar=true` | 200, diasExcluidos |

Todas exigem a política Admin. Datas e intervalos inválidos retornam 400.
A exclusão sem datas existentes retorna 404; a exclusão de período com histórico
protegido retorna 409, sem excluir nenhuma data. O DELETE anual exige confirmação
explícita. O front-end deve pedir confirmação ao usuário antes de chamar a rota.

## Corrigir o calendário que foi gerado apenas com domingos

Use **PUT /api/admin/calendario/reconfigurar** (não POST gerar):

```json
{
  "inicio": "2026-01-01",
  "fim": "2026-12-31",
  "diasSemanaLetivos": [1, 2, 3, 4, 5, 6],
  "preservarExcecoes": true
}
```

Segunda = 1, domingo = 7. O intervalo aceita até 366 datas inclusivas.
Uma lista vazia de dias significa que nenhum dia semanal será marcado letivo.
A operação insere as datas ausentes e atualiza as geradas anteriormente.
A resposta contém `diasInseridos`, `diasAtualizados`, `diasSemAlteracao`,
`datasManuaisPreservadas` e `datasProtegidas`. As cinco categorias são distintas.
Execute GET do calendário para conferir o resultado e revise feriados e recessos.
Os horários semanais por turma continuam determinando quais turmas têm aula.

### Preservação e limites

- `preservarExcecoes` é true por padrão. Datas editadas manualmente no calendário
  geral são preservadas. Para distinguir datas geradas de manuais sem alterar o
  banco, são reconhecidas as duas descrições originais da API e do script SQL:
  `Calendário gerado; revisar feriados e recessos` e
  `Calendario inicial - revisar feriados e recessos`. Descrições diferentes,
  inclusive nulas, são tratadas como manuais. Se dados antigos usarem esses textos
  reservados em edições manuais, a origem não pode ser distinguida; revise antes.
- `preservarExcecoes: false` permite sobrescrever datas manuais do calendário geral,
  inclusive feriados. Não afeta a tabela de exceções por turma.
- Datas com atrasos e todo intervalo de alertas de recorrência já existentes são
  protegidos, inclusive quando `preservarExcecoes` é false. A reconfiguração pula
  essas datas e informa quais foram protegidas. O PUT individual permite mudar a
  descrição de uma data protegida existente, mas não seu status letivo.
- A exclusão anual apaga somente o calendário geral do ano solicitado, inclusive
  feriados manuais, se não houver histórico protegido no período. Não exclui
  turmas, alunos, matrículas, horários, exceções por turma ou atrasos.
- Datas ausentes no calendário geral são tratadas como não letivas (salvo exceção
  de turma). Por isso, prefira reconfigurar em vez de apagar.
- Alterar dias anteriores sem registros ou alertas pode afetar cálculos futuros de
  recorrência. Alertas históricos não são recalculados automaticamente. Revise
  mudanças retroativas antes de aplicá-las em produção.
- A proteção é aplicada às operações do calendário geral, não aos endpoints
  preexistentes de edição de horários ou exceções específicas por turma.

## Roteiro de testes (usar banco de teste)

- Gerar um ano vazio com apenas domingo; confirmar 365 ou 366 dias inseridos.
- Repetir POST com segunda a sábado; confirmar zero inseridos.
- PUT reconfigurar com segunda a sábado; verificar uma terça, sábado e domingo no GET.
- Editar uma data sem histórico com descrição de feriado e diaLetivo=false;
  repetir a reconfiguração com preservarExcecoes=true e confirmar preservação.
- Repetir o PUT com os mesmos parâmetros: datas geradas corretas não são atualizadas.
- Conferir reconfiguração com data que possui atraso e com intervalo de alerta;
  devem aparecer em datasProtegidas e não sofrer alterações.
- Testar DELETE de data protegida e DELETE do ano com histórico: esperar 409.
- Em ano sem histórico, testar DELETE anual sem confirmar: esperar 400;
  confirmar explicitamente: esperar 200. Conferir GET vazio e gerar novamente.
- Testar acesso sem token ou sem perfil ADMIN: esperar 401 ou 403.

A alteração foi revisada estaticamente. O ambiente de edição não possui o SDK
.NET nem acesso ao SQL Server; a compilação e os testes de integração acima ainda
precisam ser executados localmente.
