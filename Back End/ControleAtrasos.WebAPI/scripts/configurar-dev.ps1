# Rodar no PowerShell, na pasta do projeto: .\scripts\configurar-dev.ps1
# Cria duas chaves criptograficamente aleatorias no armazenamento local de User Secrets.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    throw 'Instale o SDK .NET 10 e reinicie o terminal.'
  }
  $existing = @(dotnet user-secrets list)
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao consultar User Secrets.' }
  if (($existing | Where-Object { $_ -match '^Jwt:Key\s*=' }) -or
      ($existing | Where-Object { $_ -match '^Security:CpfHmacKey\s*=' })) {
    throw 'Ja existem chaves configuradas. Nao rotacione CpfHmacKey: CPFs cadastrados podem deixar de funcionar. Para banco compartilhado, importe a chave original por canal seguro.'
  }
  $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $jwtBytes = New-Object byte[] 48
    $hmacBytes = New-Object byte[] 48
    $rng.GetBytes($jwtBytes)
    $rng.GetBytes($hmacBytes)
    $jwt = [Convert]::ToBase64String($jwtBytes)
    $hmac = [Convert]::ToBase64String($hmacBytes)
  } finally { $rng.Dispose() }
  dotnet user-secrets set 'Jwt:Key' "$jwt" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao configurar Jwt:Key.' }
  dotnet user-secrets set 'Security:CpfHmacKey' "$hmac" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao configurar Security:CpfHmacKey.' }
  Write-Host 'Chaves novas para um banco de testes local criadas com sucesso.' -ForegroundColor Green
  Write-Host 'Configure ConnectionStrings:Default caso a sua instancia de SQL Server seja diferente de localhost.'
  Write-Host 'ATENCAO: para banco compartilhado, use Security:CpfHmacKey original em cada instancia; nao gere chaves novas.'
} finally { Pop-Location }
