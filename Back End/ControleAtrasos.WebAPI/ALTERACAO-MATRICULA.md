# Cadastro sem número de matrícula

## Escopo

Alteração baseada na versão com gerenciamento do calendário. Mantém o banco existente, o histórico de alunos, os vínculos com turmas e as regras de atrasos e recorrências. A coluna legada `Alunos.Matricula` (nvarchar(60), NOT NULL, UNIQUE) é preenchida com `AUTO-` + GUID de 32 caracteres para novos alunos. Os códigos dos alunos existentes não são alterados.

## Contrato atualizado

`POST /api/admin/alunos` (administrador):

```json
{
  "nome": "Aluno Teste",
  "cpf": "INSIRA_UM_CPF_VALIDO_DE_TESTE"
}
```

Resposta HTTP 201 (ID ilustrativo):

```json
{
  "idAluno": 1,
  "nome": "Aluno Teste",
  "ativo": true
}
```

O `GET /api/admin/alunos` e o `PUT /api/admin/alunos/{id}` retornam o mesmo formato de aluno (o GET retorna uma lista). As consultas de atrasos do professor e da gestão também deixam de retornar o campo `matricula` de número de matrícula. Ajuste interfaces TypeScript, formulários, tabelas e filtros do front-end que dependam desse campo. Os campos `idMatricula` e `matriculasDistintas` relativos ao vínculo aluno-turma continuam existentes.

## Testes no seu ambiente

1. Preserve a conexão e as chaves dos User Secrets existentes. Execute `dotnet restore` e `dotnet build`, depois inicie a API.
2. Faça login como administrador. Cadastre um aluno com CPF válido de teste e nome, sem informar matrícula. Esperado: HTTP 201.
3. Repita com o mesmo CPF. Esperado: HTTP 409. Teste um CPF inválido: HTTP 400.
4. Consulte a listagem e edite o aluno. Esperado: sem campo de número de matrícula. Alunos antigos devem continuar acessíveis.
5. Vincule o aluno a uma turma via `POST /api/admin/matriculas` com `idAluno`, `idTurma`, `dataMatricula` e `dataSaida` (opcional). Use IDs reais do banco de testes. Não há número de matrícula nessa operação.
6. Com calendário e horário vigentes, após a tolerância, teste `/api/registro/identificar` e `/api/registro/confirmar`. Consulte os atrasos pelo professor/gestão e confirme que não há campo `matricula`.
7. Verifique os endpoints administrativos de calendário da versão anterior.

## Validação realizada

Revisão estática das assinaturas, chamadas e DTOs. Compilação e testes com SQL Server não executados neste ambiente.
