# Installer for Windows.
# Every value below is rewritten by scripts/sync-brand.mjs from brand.json.
# Usage:
# @brand:start usage
#   irm https://raw.githubusercontent.com/tonmoydeb404/cam-tuner/main/setup/windows.ps1 | iex
# @brand:end usage
$ErrorActionPreference = "Stop"

$Repo = "tonmoydeb404/cam-tuner"
$AppName = "CamTuner"
# Pinned by scripts/sync-brand.mjs on every release; avoids api.github.com
# (rate limited to 60 requests/hour per IP, shared by every machine behind
# the same network).
$DefaultVersion = "v3.1.2"
$Version = if ($env:APP_VERSION) { $env:APP_VERSION } else { $DefaultVersion }
$Version = $Version -replace '^v', ''
$Tag = "v$Version"

if ($Version -eq "latest") {
    Write-Host "This installer ships a pinned default version instead of querying"
    Write-Host "the rate-limited GitHub API. Set APP_VERSION to an explicit"
    Write-Host "version (e.g. v2.0.3) or browse releases:"
    Write-Host "https://github.com/$Repo/releases"
    exit 1
}

if ($env:PROCESSOR_ARCHITECTURE -ne "AMD64") {
    Write-Host "Only x64 builds are currently published for Windows."
    Write-Host "Download other builds manually from: https://github.com/$Repo/releases/latest"
    exit 1
}

$assetName = "${AppName}_${Version}_x64-setup.exe"
$downloadUrl = "https://github.com/$Repo/releases/download/$Tag/$assetName"
$installerPath = Join-Path $env:TEMP $assetName

Write-Host "==> Downloading $AppName ($Tag)..."
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath
} catch {
    Write-Host "Download failed: $downloadUrl"
    Write-Host "Browse available releases: https://github.com/$Repo/releases"
    exit 1
}

Write-Host "==> Installing $AppName (silent)..."
Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait

Remove-Item $installerPath -ErrorAction SilentlyContinue

Write-Host "==> Done! Launch $AppName from the Start menu."
