# Remoção de dias do calendário geral

A operação `PUT /api/admin/calendario/reconfigurar` aceita o campo opcional `removerDiasNaoLetivos` (padrão `false`, compatível com versões anteriores). Quando `true`, remove fisicamente do calendário geral as datas de dias da semana não selecionados, sem inserir linhas para essas datas caso já estejam ausentes. Não altera datas protegidas por atrasos ou intervalos de alertas; preserva datas manuais se `preservarExcecoes` for `true`. As exceções específicas de turma não são alteradas e continuam tendo prioridade. O endpoint de geração anterior continua com seu comportamento original.

Exemplo: corrigir 2026, selecionando segunda a sábado:

```json
{
  "inicio": "2026-01-01",
  "fim": "2026-12-31",
  "diasSemanaLetivos": [1, 2, 3, 4, 5, 6],
  "preservarExcecoes": true,
  "removerDiasNaoLetivos": true
}
```

A resposta inclui `diasExcluidos` e as listas de datas manuais e protegidas. Consulte `GET /api/admin/calendario?ano=2026` para confirmar. Se necessário, `preservarExcecoes: false` também permite modificar ou excluir datas manuais sem histórico protegido; isso pode sobrescrever feriados e recessos. Revise o calendário oficial antes de aplicar. Não é necessário alterar o banco ou rodar scaffold.

Testes manuais sugeridos em banco de desenvolvimento: excluir um domingo automático sem histórico; repetir a operação e confirmar zero exclusões; preservar um domingo manual com a opção ativa; conferir que datas protegidas não mudaram; confirmar que a ausência de uma data geral não letiva bloqueia o registro salvo exceção de turma.
