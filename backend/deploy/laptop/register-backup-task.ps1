<#
.SYNOPSIS
  Registers a Windows Task Scheduler job "Laddu Gopal Postgres backup" that runs backup.ps1 daily.

.DESCRIPTION
  Runs as you, only while you are signed in (Docker Desktop is per-user). "Start when
  available": if the laptop was off at the set time, it runs as soon as it can.
  Re-running updates the task. Remove with:
    Unregister-ScheduledTask -TaskName "Laddu Gopal Postgres backup"

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\register-backup-task.ps1
  powershell -ExecutionPolicy Bypass -File .\register-backup-task.ps1 -At "03:30" -CopyTo "G:\My Drive\LaddoGopal-backups"
#>
param(
    # 03:30 so it doesn't run at the same minute as the CBP backup (03:00)
    [string]$At = "03:30",
    [string]$CopyTo = ""
)

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$script = Join-Path $here "backup.ps1"
if (-not (Test-Path $script)) { throw "backup.ps1 not found next to this script" }

$arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
if ($CopyTo) { $arguments += " -CopyTo `"$CopyTo`"" }

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arguments -WorkingDirectory $here
$trigger = New-ScheduledTaskTrigger -Daily -At $At
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30) -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName "Laddu Gopal Postgres backup" -Description "Daily backup of the Laddu Gopal Enterprise database ($here\backup.ps1)" `
    -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null

Write-Output "Registered 'Laddu Gopal Postgres backup' - daily at $At. Test it now with:"
Write-Output "  Start-ScheduledTask -TaskName 'Laddu Gopal Postgres backup'; Get-Content '$here\backups\backup.log' -Tail 5"
