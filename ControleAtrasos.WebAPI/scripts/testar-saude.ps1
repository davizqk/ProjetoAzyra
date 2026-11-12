$ErrorActionPreference = 'Stop'
$baseUrl = 'http://localhost:5080'
Write-Host "Testando $baseUrl/api/saude"
Invoke-RestMethod -Method Get -Uri "$baseUrl/api/saude" | ConvertTo-Json
