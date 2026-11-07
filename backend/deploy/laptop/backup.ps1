<#
.SYNOPSIS
  Daily database backup for the Laddu Gopal laptop backend, into .\backups
  (optionally copied to Google Drive / OneDrive).

.DESCRIPTION
  pg_dump "custom" format (compressed; restore with pg_restore), written inside the postgres
  container and copied out with "docker compose cp" (piping binary output through Windows
  PowerShell would corrupt it). Checked with "pg_restore --list" before it counts.
  Keeps the newest $Keep dumps; old ones are removed only after a new one succeeded, and only
  files named laddugopal_*.dump. -CopyTo copies the new dump there and never deletes from it.
  Writes backups\backup.log; exits 1 on failure so Task Scheduler shows it.

  Restore (replaces the current data):
    docker compose -f docker-compose.laptop.yml cp .\backups\<file>.dump postgres:/tmp/restore.dump
    docker compose -f docker-compose.laptop.yml exec postgres sh -c 'pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists --no-owner /tmp/restore.dump'

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\backup.ps1
  powershell -ExecutionPolicy Bypass -File .\backup.ps1 -CopyTo "G:\My Drive\LaddoGopal-backups"
#>
param(
    [int]$Keep = 14,
    [string]$CopyTo = ""
)

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$compose = Join-Path $here "docker-compose.laptop.yml"
$backupDir = Join-Path $here "backups"
$log = Join-Path $backupDir "backup.log"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

function Write-Log([string]$msg) {
    $line = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Write-Output $line
    Add-Content -Path $log -Value $line -Encoding ascii
}

function Invoke-Compose {
    # Exit code decides, not stderr (docker compose cp prints progress on stderr).
    $old = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try { $out = & docker compose -f $compose @args 2>&1 } finally { $ErrorActionPreference = $old }
    if ($LASTEXITCODE -ne 0) {
        $detail = (($out | ForEach-Object { "$_".Trim() }) -join ' ').Trim()
        if ($detail.Length -gt 300) { $detail = $detail.Substring(0, 300) }
        throw "docker compose $($args -join ' ') failed (exit $LASTEXITCODE): $detail"
    }
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$name = "laddugopal_$stamp.dump"
$inContainer = "/tmp/$name"
$target = Join-Path $backupDir $name

try {
    Write-Log "Backup started -> $name"
    # Credentials come from the container's own env; never printed. Single quotes: the
    # container's shell expands $POSTGRES_*, not PowerShell.
    Invoke-Compose exec -T postgres sh -c ('pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -Fc --no-owner -f ' + $inContainer)
    Invoke-Compose exec -T postgres sh -c ('pg_restore --list ' + $inContainer + ' > /dev/null')
    Invoke-Compose cp "postgres:$inContainer" $target
    Invoke-Compose exec -T postgres rm -f $inContainer

    $size = (Get-Item $target).Length
    if ($size -le 0) { throw "Backup file is empty" }
    Write-Log ("Database OK: {0} ({1:N1} KB)" -f $name, ($size / 1KB))
}
catch {
    Write-Log "BACKUP FAILED: $($_.Exception.Message)"
    if (Test-Path $target) { Remove-Item -Path $target -Force }
    try { & docker compose -f $compose exec -T postgres rm -f $inContainer 2>$null | Out-Null } catch {}
    exit 1
}

# Keep the newest $Keep dumps
Get-ChildItem -Path $backupDir -Filter "laddugopal_*.dump" | Sort-Object Name -Descending |
    Select-Object -Skip $Keep | ForEach-Object { Remove-Item $_.FullName -Force; Write-Log "Removed old backup $($_.Name)" }

if ($CopyTo) {
    try {
        New-Item -ItemType Directory -Force -Path $CopyTo | Out-Null
        Copy-Item -Path $target -Destination $CopyTo -Force
        Write-Log "Copied to $CopyTo"
    }
    catch {
        Write-Log "COPY FAILED (the local backup is fine): $($_.Exception.Message)"
        exit 1
    }
}
Write-Log "Backup finished"
