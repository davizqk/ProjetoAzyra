# Testa se a API consegue ler as tabelas do SQL Server configurado.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
$previousEnvironment = $env:ASPNETCORE_ENVIRONMENT
try {
    $env:ASPNETCORE_ENVIRONMENT = 'Development'
    & dotnet run -- --verificar-banco
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao conectar ao banco ou consultar tabelas. Consulte a mensagem acima.' }
}
finally {
    if ($null -eq $previousEnvironment) { Remove-Item Env:ASPNETCORE_ENVIRONMENT -ErrorAction SilentlyContinue }
    else { $env:ASPNETCORE_ENVIRONMENT = $previousEnvironment }
    Pop-Location
}
