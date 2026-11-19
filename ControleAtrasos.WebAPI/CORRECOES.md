# Correcoes identificadas no ZIP enviado

- `Program.cs`: bootstrap original bloqueava qualquer tabela `Usuarios` nao vazia; agora valida **ADMIN ativo** e permite criar o primeiro ADMIN mesmo que haja professores ou outros usuarios.
- `Program.cs`: novo comando `dotnet run -- --verificar-banco` para testar a conexao, listar quantidade de usuarios e admins ativos sem expor segredos.
- `scripts/criar-admin.ps1`: solicita email e senha de modo interativo, cria usuario/funcionario/papel ADMIN com BCrypt e transacao.
- `scripts/configurar-banco-compartilhado.ps1`: configura o servidor compartilhado em User Secrets; evita que os colegas conectem em `localhost`.
- `scripts/configurar-dev.ps1`: impede sobrescrita de chaves locais ja existentes; protege CPFHash de trocas acidentais.
- `sql/seed-referencias.sql`: adiciona papeis, modelos e quatro periodos (inclui Integral) sem apagar dados.
- `sql/schema.sql`: inclui Integral na instalacao inicial de banco vazio.

As demais funcionalidades foram mantidas. Compilacao e SQL Server reais precisam ser testados em um PC com .NET 10.
