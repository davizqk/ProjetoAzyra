# Execute dentro da pasta do projeto:
# .\scripts\criar-admin.ps1
# Cria o primeiro ADMIN somente se nao existir nenhum ADMIN ativo no banco.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
$previousEnvironment = $env:ASPNETCORE_ENVIRONMENT
try {
    if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { throw 'Instale o SDK .NET 10.' }
    $env:ASPNETCORE_ENVIRONMENT = 'Development'
    $email = (Read-Host 'E-mail do primeiro administrador').Trim()
    if (-not $email.Contains('@')) { throw 'E-mail invalido.' }
    $securePassword = Read-Host 'Senha do administrador (8+ caracteres)' -AsSecureString
    $pointer = [IntPtr]::Zero
    try {
        $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
        $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
        if ($password.Length -lt 8) { throw 'A senha precisa ter no minimo 8 caracteres.' }
        $env:CONTROLE_ADMIN_EMAIL = $email
        $env:CONTROLE_ADMIN_PASSWORD = $password
    }
    finally {
        if ($pointer -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
        }
        $password = $null
    }
    & dotnet run -- --seed-admin
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar ADMIN. Verifique a mensagem acima.' }
}
finally {
    Remove-Item Env:CONTROLE_ADMIN_EMAIL -ErrorAction SilentlyContinue
    Remove-Item Env:CONTROLE_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    if ($null -eq $previousEnvironment) { Remove-Item Env:ASPNETCORE_ENVIRONMENT -ErrorAction SilentlyContinue }
    else { $env:ASPNETCORE_ENVIRONMENT = $previousEnvironment }
    Pop-Location
}
