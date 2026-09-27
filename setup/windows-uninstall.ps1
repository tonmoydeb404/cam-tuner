# Uninstaller for Windows.
# Every value below is rewritten by scripts/sync-brand.mjs from brand.json.
# Usage:
# @brand:start usage
#   irm https://raw.githubusercontent.com/tonmoydeb404/cam-tuner/main/setup/windows-uninstall.ps1 | iex
# @brand:end usage
$ErrorActionPreference = "Stop"

$Repo = "tonmoydeb404/cam-tuner"
$Identifier = "app.camtuner"
$AppName = "CamTuner"

Write-Host "==> Quitting $AppName if it is running..."
Get-Process -Name $AppName -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "==> Uninstalling $AppName..."
$uninstallKeys = @(
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)
$entry = Get-ItemProperty $uninstallKeys -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -eq $AppName } |
    Select-Object -First 1

if ($entry) {
    if ($entry.QuietUninstallString) {
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $entry.QuietUninstallString -Wait -WindowStyle Hidden
    } elseif ($entry.UninstallString) {
        $exe = $entry.UninstallString.Trim('"')
        Start-Process -FilePath $exe -ArgumentList "/S" -Wait -WindowStyle Hidden
    }
    Write-Host "==> Ran registered uninstaller."
} else {
    Write-Host "==> No registered installer found; skipping."
}

Write-Host "==> Removing launch-at-login entry..."
Remove-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name $AppName -ErrorAction SilentlyContinue

Write-Host "==> Removing user data..."
$paths = @(
    "$env:APPDATA\$Identifier",
    "$env:LOCALAPPDATA\$Identifier",
    "$env:LOCALAPPDATA\$AppName"
)
foreach ($p in $paths) {
    if (Test-Path $p) {
        Remove-Item -Recurse -Force $p -ErrorAction SilentlyContinue
    }
}

Write-Host "==> Done! $AppName has been removed."
