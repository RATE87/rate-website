$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$node = (Get-Command node.exe).Source
$watcher = Join-Path $projectRoot "scripts\pokemon-center-watch.mjs"
$taskName = "Pokemon Center UK Watcher"

$action = New-ScheduledTaskAction `
  -Execute $node `
  -Argument "`"$watcher`"" `
  -WorkingDirectory $projectRoot

$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Runs the Pokemon Center UK release watcher at login." `
  -Force | Out-Null

Write-Host "Installed scheduled task: $taskName"
Write-Host "It will start automatically the next time you sign in."
Write-Host "To start it now, run: Start-ScheduledTask -TaskName '$taskName'"
