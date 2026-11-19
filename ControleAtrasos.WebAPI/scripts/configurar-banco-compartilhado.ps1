# Configure a string de conexao com o SQL Server compartilhado, SEM gravar senha no codigo fonte.
# Execute dentro da pasta do projeto: .\scripts\configurar-banco-compartilhado.ps1
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $servidor = (Read-Host 'Servidor SQL (ex.: tcp:192.168.1.50,51433)').Trim()
    $banco = (Read-Host 'Nome do banco (ex.: ControleAtrasos)').Trim()
    $usuario = (Read-Host 'Usuario SQL com acesso ao banco').Trim()
    if ($servidor -notmatch '^[A-Za-z0-9\._:,\-]+$') { throw 'Nome de servidor invalido.' }
    if ($banco -notmatch '^[A-Za-z0-9_-]+$') { throw 'Nome de banco invalido.' }
    if ($usuario -notmatch '^[A-Za-z0-9_.@-]+$') { throw 'Usuario SQL invalido.' }
    $securePassword = Read-Host 'Senha do usuario SQL' -AsSecureString
    $pointer = [IntPtr]::Zero
    try {
        $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
        $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
        # Senhas com ; ou = precisam ser escapadas conforme a sintaxe da connection string.
        # SqlConnectionStringBuilder faz esse trabalho sem concatenar valores diretamente.
                $builder = New-Object System.Data.Common.DbConnectionStringBuilder
        $builder['Server'] = $servidor
        $builder['Database'] = $banco
        $builder['User ID'] = $usuario
        $builder['Password'] = $password
        $builder['Encrypt'] = 'True'
        $builder['TrustServerCertificate'] = 'True' # somente desenvolvimento em rede confiavel
        $builder['Connect Timeout'] = 10
        & dotnet user-secrets set 'ConnectionStrings:Default' $builder.ConnectionString | Out-Null
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel gravar ConnectionStrings:Default.' }
        Write-Host 'Conexao salva em User Secrets. Execute .\scripts\verificar-banco.ps1.' -ForegroundColor Green
    }
    finally {
        if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
        $password = $null
    }
}
finally { Pop-Location }
