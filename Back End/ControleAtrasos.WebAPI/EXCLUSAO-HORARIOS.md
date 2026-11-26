# Exclusão individual de horários de turma

- `GET /api/admin/horarios?turmaId=1`: consulta horários existentes (ativos e inativos).
- `DELETE /api/admin/horarios/{id}`: exclui exclusivamente o horário identificado por `idHorario`. Não exclui a turma, matrícula, calendário geral, atrasos ou outros horários. Requer perfil ADMIN; não recebe corpo.
- 204: excluído; 404: inexistente; 400: ID inválido; 409: histórico de atraso, alerta da mesma turma que pode depender do horário ou solicitação confirmada/válida. Solicitações expiradas e nunca confirmadas desse horário são removidas na mesma transação, pois têm FK para o horário.
- Se a exclusão for bloqueada por histórico, não apague os registros para contornar a proteção. O PUT existente permite desativar o horário, mas desativar retroativamente também pode afetar cálculos de recorrência; avalie o histórico antes de fazê-lo.

## Teste manual em banco de desenvolvimento
1. Cadastre uma turma com terça, quarta, quinta e sexta, sem histórico nos horários incorretos.
2. Liste os horários filtrando por ID da turma.
3. Exclua pelo idHorario de quarta (diaSemana 3) e sexta (diaSemana 5). Cada DELETE deve retornar 204.
4. Consulte novamente; devem restar terça (2) e quinta (4).
5. Repita um DELETE já concluído: deve retornar 404.
6. Teste com um horário associado a atraso ou alerta e confira o 409, sem alteração no histórico.
7. Teste sem autorização e com perfil não administrador (401/403).

Não há alterações no DDL, nas chaves ou nos endpoints anteriores.
