#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/mystry112000/ADHICODE-Studio"
BINARY="ADHICODE-Studio"
INSTALL_DIR="${HOME}/.adhicode-studio"

echo "╔═══════════════════════════════════════╗"
echo "║     ADHICODE Studio Installer         ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Detect platform
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux)   PLATFORM="linux" ;;
  Darwin)  PLATFORM="darwin" ;;
  *)       echo "✘ Unsupported OS: $OS"; exit 1 ;;
esac

# Check if Bun is installed (needed for binary)
if ! command -v bun &>/dev/null; then
  echo "⬇ Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Create install dir
mkdir -p "$INSTALL_DIR"

# Download or build
echo "⬇ Downloading ADHICODE Studio..."
LATEST_URL="$REPO_URL/releases/latest/download/$BINARY-$PLATFORM-$ARCH"

if curl -fsSL "$LATEST_URL" -o "$INSTALL_DIR/$BINARY" 2>/dev/null; then
  chmod +x "$INSTALL_DIR/$BINARY"
  echo "✔ Downloaded successfully"
else
  echo "⚠ Binary not found, building from source..."
  TMP_DIR=$(mktemp -d)
  git clone --depth 1 "$REPO_URL" "$TMP_DIR"
  cd "$TMP_DIR"
  bun install
  bun run build
  cp "$BINARY" "$INSTALL_DIR/"
  rm -rf "$TMP_DIR"
  echo "✔ Built from source"
fi

# Add to PATH
if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
  SHELL_CONFIG="$HOME/.bashrc"
  if [ "$SHELL" = "/bin/zsh" ] || [ "$SHELL" = "/usr/bin/zsh" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
  fi
  echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> "$SHELL_CONFIG"
  export PATH="$PATH:$INSTALL_DIR"
  echo "✔ Added to PATH in $SHELL_CONFIG"
fi

# Enable tab completion
echo "⬇ Enabling tab completion..."
SHELL_CONFIG="$HOME/.bashrc"
if command -v zsh &>/dev/null; then
  SHELL_CONFIG="$HOME/.zshrc"
fi
"$INSTALL_DIR/$BINARY" completions bash >> "$SHELL_CONFIG" 2>/dev/null || true
echo "✔ Tab completion added"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║      Installation Complete! 🎉        ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Run 'adhicode-studio --help' to get started"
echo "Run 'adhicode-studio server --web' for web dashboard"
echo ""
echo "Quick commands:"
echo "  adhicode-studio tools              # List all 27 tools"
echo "  adhicode-studio run websearch <q>  # Search the web"
echo "  adhicode-studio run scaffold \"build a blog with react\"  # AI scaffold"
echo "  adhicode-studio terminal           # Launch terminal"
echo ""
echo "Documentation: $REPO_URL"
