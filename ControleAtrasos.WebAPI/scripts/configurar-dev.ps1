# Rodar no PowerShell, na pasta do projeto: .\scripts\configurar-dev.ps1
# Cria duas chaves criptograficamente aleatorias no armazenamento local de User Secrets.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    throw 'Instale o SDK .NET 10 e reinicie o terminal.'
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
  dotnet user-secrets set 'Jwt:Key' "$jwt"
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao configurar Jwt:Key.' }
  dotnet user-secrets set 'Security:CpfHmacKey' "$hmac"
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao configurar Security:CpfHmacKey.' }
  Write-Host 'Chaves de desenvolvimento criadas com sucesso.' -ForegroundColor Green
  Write-Host 'Configure ConnectionStrings:Default caso a sua instancia de SQL Server seja diferente de localhost.'
  Write-Host 'Nao execute novamente em banco com alunos cadastrados sem migrar os hashes de CPF.'
} finally { Pop-Location }
