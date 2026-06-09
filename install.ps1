#!/usr/bin/env pwsh
# ADHICODE Studio Installer
# One-liner: iwr -useb https://raw.githubusercontent.com/mystry112000/ADHICODE-Studio/main/install.ps1 | iex

$RepoUrl = "https://github.com/mystry112000/ADHICODE-Studio"
$ExeName = "ADHICODE-Studio.exe"
$InstallDir = "$env:LOCALAPPDATA\ADHICODE-Studio"

Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     ADHICODE Studio Installer        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check for existing install
if (Test-Path "$InstallDir\$ExeName") {
    Write-Host "✔ Found existing installation" -ForegroundColor Green
    $choice = Read-Host "Update to latest version? (Y/N)"
    if ($choice -ne "Y" -and $choice -ne "y") {
        Write-Host "Installation cancelled."
        exit 0
    }
}

# Create install directory
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

# Download latest release
Write-Host "⬇ Downloading ADHICODE Studio..." -ForegroundColor Yellow
$LatestUrl = "$RepoUrl/releases/latest/download/$ExeName"

try {
    Invoke-WebRequest -Uri $LatestUrl -OutFile "$InstallDir\$ExeName" -UseBasicParsing
    Write-Host "✔ Downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "✘ Download failed. Building from source instead..." -ForegroundColor Red
    
    # Check if Bun is installed
    if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Bun..." -ForegroundColor Yellow
        powershell -c "irm bun.sh/install.ps1 | iex"
    }
    
    $tmpDir = "$env:TEMP\ADHICODE-Studio"
    Remove-Item -Path $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "Cloning repository..." -ForegroundColor Yellow
    git clone --depth 1 $RepoUrl $tmpDir 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✘ Failed to clone. Please install manually." -ForegroundColor Red
        exit 1
    }
    
    Push-Location $tmpDir
    bun install
    bun run build
    Copy-Item "ADHICODE-Studio.exe" "$InstallDir\$ExeName"
    Pop-Location
    Remove-Item -Path $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
}

# Add to PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$InstallDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$InstallDir", "User")
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "User")
    Write-Host "✔ Added to PATH" -ForegroundColor Green
}

# Enable tab completion
Write-Host "⬇ Enabling tab completion..." -ForegroundColor Yellow
try {
    $completionScript = & "$InstallDir\$ExeName" completions 2>&1 | Out-String
    $profilePath = $PROFILE.CurrentUserAllHosts
    $profileDir = Split-Path $profilePath -Parent
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    Add-Content -Path $profilePath -Value "`n# ADHICODE Studio completions`n$completionScript" -Force
    Write-Host "✔ Tab completion enabled" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not enable tab completion automatically" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║      Installation Complete! 🎉        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Run 'adhicode-studio --help' to get started" -ForegroundColor Cyan
Write-Host "Run 'adhicode-studio server --web' for web dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quick commands:" -ForegroundColor White
Write-Host "  adhicode-studio tools              # List all 26 tools" -ForegroundColor Gray
Write-Host "  adhicode-studio run websearch <q>  # Search the web" -ForegroundColor Gray
Write-Host "  adhicode-studio terminal           # Launch terminal" -ForegroundColor Gray
Write-Host "  adhicode-studio skills             # List all skills" -ForegroundColor Gray
Write-Host "  adhicode-studio workflow build     # Run build workflow" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation: $RepoUrl" -ForegroundColor Blue
