# Laddu Gopal Enterprise — one command for the laptop backend (like CBP's cbp.ps1).
#
#   .\lg.ps1 up          build + start postgres + api
#   .\lg.ps1 up -Tunnel  same, plus the Cloudflare Tunnel (needs cloudflared\config.yml + credentials.json)
#   .\lg.ps1 down        stop everything (the database volume is kept)
#   .\lg.ps1 restart     restart the containers
#   .\lg.ps1 status      containers + health checks
#   .\lg.ps1 logs [api]  follow logs
#   .\lg.ps1 backup      database backup now (same as backup.ps1)
#
# Containers use restart: unless-stopped, so after "up" they come back by themselves whenever
# Docker Desktop starts. "down" is what keeps them off.
param(
    [ValidateSet('up', 'down', 'restart', 'status', 'logs', 'backup')]
    [string]$Action = 'status',
    [string]$Service = '',
    [switch]$Tunnel
)
# Not 'Stop': docker writes progress to stderr, which Windows PowerShell 5.1 would treat as an error.
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot
$compose = @('compose', '-f', 'docker-compose.laptop.yml')
$useTunnel = $Tunnel -or (Test-Path 'cloudflared\credentials.json')
if ($useTunnel) { $compose += @('--profile', 'tunnel') }

function Test-Url($url) {
    try { (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10).StatusCode } catch { "failed: $($_.Exception.Message)" }
}

switch ($Action) {
    'up' {
        if (-not (Test-Path '.env')) { throw 'Missing .env (copy .env.laptop.example .env and fill it in; see LAPTOP.md)' }
        if ($useTunnel) {
            foreach ($f in 'cloudflared\config.yml', 'cloudflared\credentials.json') {
                if (-not (Test-Path $f)) { throw "Missing $f (see LAPTOP.md, Cloudflare Tunnel)" }
            }
        }
        docker @compose up -d --build --wait --remove-orphans
        if ($LASTEXITCODE -ne 0) { throw 'docker compose up failed — run .\lg.ps1 logs' }
        & $PSCommandPath status
    }
    'down'    { docker @compose down }
    'restart' { docker @compose restart }
    'logs'    { if ($Service) { docker @compose logs -f --tail 100 $Service } else { docker @compose logs -f --tail 100 } }
    'backup'  { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'backup.ps1') }
    'status' {
        docker @compose ps -a
        Write-Host ""
        Write-Host "API      http://127.0.0.1:8010/                -> $(Test-Url 'http://127.0.0.1:8010/')"
        try {
            $h = Invoke-RestMethod -Uri 'http://127.0.0.1:8010/api/v1/health' -TimeoutSec 10
            Write-Host "Database (via API)                            -> $($h.database)"
        } catch { Write-Host "Database (via API)                            -> failed: $($_.Exception.Message)" }
        Write-Host "API docs http://127.0.0.1:8010/docs"
        if ($useTunnel -and (Test-Path 'cloudflared\config.yml')) {
            $hostLine = Select-String -Path 'cloudflared\config.yml' -Pattern '^\s*-\s*hostname:\s*(\S+)' | Select-Object -First 1
            if ($hostLine) {
                $pub = "https://$($hostLine.Matches[0].Groups[1].Value)/"
                Write-Host "Public   $pub -> $(Test-Url $pub)"
            }
        }
    }
}
