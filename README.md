# ADHICODE Studio 🚀

> **AI-Powered Development Platform** — Terminal, Tools, Workflows & Skills in one CLI

<p align="center">
  <img src="https://img.shields.io/github/stars/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=github&color=6366f1" alt="Stars">
  <img src="https://img.shields.io/github/forks/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=github&color=06b6d4" alt="Forks">
  <img src="https://img.shields.io/github/license/mystry112000/ADHICODE-Studio?style=for-the-badge&color=22c55e" alt="License">
  <img src="https://img.shields.io/github/last-commit/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=git&color=f59e0b" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=files&color=ef4444" alt="Repo Size">
  <img src="https://img.shields.io/badge/Bun-1.3.13-black?style=for-the-badge&logo=bun" alt="Bun">
  <img src="https://img.shields.io/badge/PowerShell-✓-blue?style=for-the-badge&logo=powershell" alt="PowerShell">
  <img src="https://img.shields.io/badge/Linux-✓-yellow?style=for-the-badge&logo=linux" alt="Linux">
  <img src="https://img.shields.io/badge/Termux-✓-green?style=for-the-badge&logo=terminal" alt="Termux">
</p>

---

## One-Command Install

### Windows (PowerShell)
```powershell
iwr -useb https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.ps1 | iex
```

### Linux / macOS (Bash)
```bash
curl -fsSL https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.sh | bash
```

### Termux (Android)
```bash
pkg install nodejs-lts && npm install -g bun && curl -fsSL https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.sh | bash
```

After install, run: `adhicode-studio --help`

> Or download the latest release from the [Releases page](https://github.com/mystry112000/ADHICODE-Studio/releases).

---

## ✨ Features

### 🛠 26 Built-in Tools

| Category | Tools |
|----------|-------|
| **CODE** | `format` `lint` `review` `tree` `search` |
| **SYSTEM** | `sysinfo` `process` `disk` `weather` `notify` |
| **WEB** | `shorten` `whois` `headers` `qr` |
| **DEVOPS** | `docker` `gitlog` `deploy` `ports` |
| **FULLSTACK** | `websearch` `react` `api` `db-migrate` `docker-compose` `tailwind` `github-actions` `restore` |

### 🧠 9 Skills

`code-review` · `project-init` · `fullstack-dev` · `terminal-pro` · `termux-optimize` · `voice-control` · `workflow-designer` · `database-pro` · `security-audit`

### 🔄 7 Workflows

`analyze` · `build` · `deploy` · `test` · `review` · `scaffold` · `audit`

### 🌐 Web Dashboard

Start a beautiful web UI with one command:

```bash
adhicode-studio server --web
```

Then open `http://localhost:4096` in your browser.

---

## 📦 Quick Start

### Windows
```powershell
iwr -useb https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.ps1 | iex
```

### Linux / macOS
```bash
curl -fsSL https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.sh | bash
```

### Termux (Android)
```bash
pkg install nodejs-lts && npm install -g bun && curl -fsSL https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.sh | bash
```

### Manual Install
1. Download `ADHICODE-Studio.exe` from [Releases](https://github.com/mystry112000/ADHICODE-Studio/releases)
2. Add it to your PATH
3. Run `adhicode-studio --help`

### Build from Source

```bash
# Prerequisites: Install Bun (https://bun.sh)
bun install
bun run build
./ADHICODE-Studio.exe --help
```

---

## 🎯 Commands

```bash
adhicode-studio tools              # List all 26 built-in tools
adhicode-studio run <tool> [args]  # Run a specific tool
adhicode-studio skills             # List all 9 skills
adhicode-studio skill <name>       # Run a skill
adhicode-studio workflow           # List all 7 workflows
adhicode-studio workflow <name>    # Run a workflow
adhicode-studio terminal           # Launch interactive terminal
adhicode-studio jarvis             # Launch Jarvis voice AI
adhicode-studio ai <message>       # Ask AI directly
adhicode-studio server             # Start API server
adhicode-studio server --web       # Start server + web dashboard
adhicode-studio config             # Show configuration
adhicode-studio config-set <k> <v> # Set configuration
adhicode-studio completions        # Generate tab-completion script
```

---

## 💻 Usage Examples

### AI Prompt Scaffolding (Just describe what you want)
```bash
adhicode-studio run scaffold "create a blog with react and tailwind"
# → Detects FRONTEND → Creates blog-react-tailwind project

adhicode-studio run scaffold "build a rest api with hono and drizzle"
# → Detects BACKEND → Creates rest project with Hono API + Drizzle ORM

adhicode-studio run scaffold "make a fullstack dashboard with react frontend and hono api"
# → Detects FULLSTACK → Creates monorepo with both frontend and backend
```

You can also use classic mode:
```bash
adhicode-studio run scaffold frontend my-app
adhicode-studio run scaffold fullstack my-app
adhicode-studio run scaffold backend my-api
```

### Create a React Component
```bash
adhicode-studio run react UserProfile
# Creates UserProfile.tsx
```

### Generate a REST API Endpoint
```bash
adhicode-studio run api users
# Creates users.ts with GET + POST routes
```

### Generate Docker Compose
```bash
adhicode-studio run docker-compose
# Creates docker-compose.yml with app + postgres
```

### System Info
```bash
adhicode-studio run sysinfo
# Shows CPU, memory, platform, uptime
```

### Check Weather
```bash
adhicode-studio run weather "Kanyakumari"
```

### Create TailwindCSS Project
```bash
adhicode-studio run tailwind
adhicode-studio run github-actions ci
```

---

## 🖥 Interactive Terminal Mode

```bash
adhicode-studio terminal
```

Opens a full-featured terminal with:
- Tab autocompletion (commands, tools, files)
- Built-in AI assistant (`ai <message>`)
- Tool runner (`run <tool>`)
- SSH client (`ssh <host>`)
- Code editor (`code <file>`)
- File system (`ls`, `cd`, `pwd`)
- Workflow launcher (`workflow`)

---

## 🌍 Platform Support

| Platform | Status |
|----------|--------|
| Windows | ✅ Full support |
| Linux | ✅ Full support |
| macOS | ✅ Full support |
| Android (Termux) | ✅ Full support via `--portable` flag |

### 📱 Termux (Android) Usage

Install Termux from [F-Droid](https://f-droid.org/packages/com.termux/), then:

```bash
pkg update && pkg upgrade
pkg install nodejs-lts
npm install -g bun

# Install ADHICODE Studio
curl -fsSL https://github.com/mystry112000/ADHICODE-Studio/releases/latest/download/install.sh | bash

# Run with portable flag for mobile optimization
adhicode-studio terminal --portable
```

Termux-specific features:
- **Auto-detection** — ADHICODE detects Termux via `$TERMUX_VERSION` env
- **Touch-friendly** — Larger tap targets, swipe gestures
- **Battery optimized** — Reduced polling, efficient rendering
- **SSH ready** — Pre-configured for Termux SSH connections
- **Smaller font** — Optimized for mobile screen sizes
- **Skill available**: `adhicode-studio skill termux-optimize`

---

## 🧠 Skills (9)

| Skill | Description |
|-------|-------------|
| `code-review` | AI-powered code review |
| `project-init` | Scaffold full-stack projects |
| `fullstack-dev` | Full-stack development toolkit |
| `terminal-pro` | Enhanced terminal with themes |
| `termux-optimize` | Optimize for Termux Android |
| `voice-control` | Jarvis voice AI integration |
| `workflow-designer` | Create custom automation |
| `database-pro` | Database management tools |
| `security-audit` | Security scanning |

---

## 🔧 Tab Completion

Enable autocomplete for your shell:

```powershell
# PowerShell
adhicode-studio completions powershell | Out-String | Invoke-Expression

# Add to your $PROFILE for persistence:
adhicode-studio completions powershell >> $PROFILE
```

```bash
# Bash
adhicode-studio completions bash >> ~/.bashrc
source ~/.bashrc
```

---

## 🧩 Built-in Tools Reference

### Code Tools
| Tool | Description | Usage |
|------|-------------|-------|
| `format` | Format code with Prettier | `run format <file-or-dir>` |
| `lint` | Lint code with ESLint/TSC | `run lint <file-or-dir>` |
| `review` | AI-powered code review | `run review <file>` |
| `tree` | Display directory tree | `run tree [dir]` |
| `search` | Search code with ripgrep | `run search <pattern> [path]` |

### System Tools
| Tool | Description | Usage |
|------|-------------|-------|
| `sysinfo` | System information | `run sysinfo` |
| `process` | Process manager | `run process` / `run process kill <pid>` |
| `disk` | Disk usage | `run disk` |
| `weather` | Weather lookup | `run weather <city>` |
| `notify` | Desktop notification | `run notify <message>` |

### Web Tools
| Tool | Description | Usage |
|------|-------------|-------|
| `shorten` | Shorten a URL | `run shorten <url>` |
| `whois` | Domain WHOIS lookup | `run whois <domain>` |
| `headers` | Check HTTP headers | `run headers <url>` |
| `qr` | Generate QR code | `run qr <text-or-url>` |

### DevOps Tools
| Tool | Description | Usage |
|------|-------------|-------|
| `docker` | Docker commands | `run docker ps` |
| `gitlog` | Git log viewer | `run gitlog [count]` |
| `deploy` | Deployment helpers | `run deploy [target]` |
| `ports` | List listening ports | `run ports` |

### Full-Stack Tools
| Tool | Description | Usage |
|------|-------------|-------|
| `websearch` | Web search (DuckDuckGo) | `run websearch <query>` |
| `react` | React component generator | `run react ComponentName` |
| `api` | REST API endpoint generator | `run api endpoint-name` |
| `db-migrate` | DB migration template | `run db-migrate <name>` |
| `docker-compose` | Docker Compose generator | `run docker-compose` |
| `tailwind` | TailwindCSS setup | `run tailwind` |
| `github-actions` | GitHub Actions CI/CD | `run github-actions [ci\|deploy]` |
| `restore` | Project snapshot | `run restore [name]` |

---

## 🏗 Project Structure

```
ADHICODE-Studio/
├── ADHICODE-Studio.exe   # Compiled CLI (standalone)
├── src/
│   ├── index.ts          # CLI entry point
│   ├── boot.ts           # System initialization
│   ├── cli/
│   │   ├── ui.ts         # Terminal UI (colors, banner, tables)
│   │   ├── commands/     # Command handlers
│   │   ├── tools/        # Tool system (26 tools)
│   │   └── workflows/    # Workflow engine
│   ├── server/
│   │   └── dashboard.ts  # Web UI dashboard
│   ├── platform/
│   │   └── adapter.ts    # Platform detection
│   ├── session/          # AI session prompts
│   └── completions/      # Shell completion scripts
├── jarvis-assistant/     # Python voice assistant
├── jarvis-bun/           # TypeScript AI backend
├── TerminalVault/        # Mobile terminal app
└── Kanyakumari-Website/  # Demo static site
```

---

## 🛠 Development

```bash
git clone https://github.com/mystry112000/ADHICODE-Studio.git
cd ADHICODE-Studio
bun install

# Run in dev mode:
bun run dev --help

# Build standalone executable:
bun run build

# Run type check:
bun run typecheck
```

---

## 🤝 Contributing

Contributions make this better! Here's how:

1. **⭐ Star the repo** — helps others discover it
2. **🍴 Fork** it and create a feature branch (`git checkout -b feature/amazing`)
3. **💬 Open an issue** for bugs or feature requests
4. **🔀 Submit a PR** with your changes
5. **📣 Share** with your network

---

## ⭐ Show Your Support

If you find this useful, please **star the repo** — it helps a lot!

<p align="center">
  <a href="https://github.com/mystry112000/ADHICODE-Studio/stargazers">
    <img src="https://img.shields.io/github/stars/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=github&color=6366f1" alt="Stars">
  </a>
  <a href="https://github.com/mystry112000/ADHICODE-Studio/fork">
    <img src="https://img.shields.io/github/forks/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=github&color=06b6d4" alt="Forks">
  </a>
  <a href="https://github.com/mystry112000/ADHICODE-Studio/issues">
    <img src="https://img.shields.io/github/issues/mystry112000/ADHICODE-Studio?style=for-the-badge&logo=github&color=f59e0b" alt="Issues">
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20ADHICODE%20Studio%20-%20an%20AI-powered%20dev%20platform!&url=https://github.com/mystry112000/ADHICODE-Studio">
    <img src="https://img.shields.io/badge/Tweet-Share-1DA1F2?style=for-the-badge&logo=twitter" alt="Tweet">
  </a>
  <a href="https://www.reddit.com/submit?title=ADHICODE%20Studio%20-%20AI%20Dev%20Platform&url=https://github.com/mystry112000/ADHICODE-Studio">
    <img src="https://img.shields.io/badge/Reddit-Post-FF4500?style=for-the-badge&logo=reddit" alt="Reddit">
  </a>
</p>

---

## 📄 License

MIT — use it, share it, build with it.

---

<p align="center">
  <b>ADHICODE Studio</b> — Built with ❤️ and <a href="https://bun.sh">Bun</a>
  <br>
  <a href="https://github.com/mystry112000/ADHICODE-Studio">GitHub</a> ·
  <a href="https://github.com/mystry112000/ADHICODE-Studio/issues">Issues</a> ·
  <a href="https://github.com/mystry112000/ADHICODE-Studio/releases">Releases</a>
  <br><br>
  <sub>If you like this project, <b>star ⭐</b> it to help others find it!</sub>
</p>
