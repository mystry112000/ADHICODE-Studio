# ADHICODE Studio v2.0
# AI-Powered Development Platform

## Architecture

```
src/
  index.ts          - CLI entry point (yargs)
  boot.ts           - System initialization
  cli/
    ui.ts           - Terminal UI helpers (banner, colors, tables)
    commands/       - CLI command handlers
      ai.ts         - AI query command
      jarvis.ts     - Jarvis voice assistant launcher
      terminal.ts   - Terminal emulator with REPL
      server.ts     - API server launcher
      workflow.ts   - Workflow runner
      config.ts     - Configuration management
    tools/          - Built-in tools system
      registry.ts   - Tool registration and lookup
      code-tools.ts - Code analysis tools
      system-tools.ts - System utilities
      web-tools.ts  - Web/network tools
      devops-tools.ts - DevOps tools
      skills.ts     - Skill definitions
    workflows/      - Workflow engine
      registry.ts   - Workflow definitions
  platform/         - Platform adapters
    adapter.ts      - Windows/Linux/Termux detection
  session/prompt/   - AI system prompts
```

## Commands

| Command | Description |
|---------|-------------|
| `jarvis [message]` | Launch Jarvis AI voice assistant |
| `terminal [--portable]` | Launch built-in terminal emulator |
| `tools list` | List all built-in tools |
| `tools run <tool> [args]` | Run a specific tool |
| `workflow <name>` | Run a predefined workflow |
| `workflow --list` | List all workflows |
| `ai <message>` | Ask AI directly via ADHICODE engine |
| `server [--port] [--web]` | Start API server |
| `skill run <name>` | Run a specialized skill |
| `config show` | Show configuration |
| `config set <key> <value>` | Set configuration value |

## Built-in Tools

- **Code**: format, lint, review, tree, search
- **System**: sysinfo, process, disk, weather, notify
- **Web**: shorten, whois, headers, qr
- **DevOps**: docker, gitlog, deploy, ports

## Workflows

analyze, build, deploy, test, review, scaffold, audit

## Skills

code-review, project-init, terminal-pro, termux-optimize, voice-control, workflow-designer

## Building

```bash
bun install
bun run build    # Windows x64
```

## Platform Support

- Windows (native)
- Linux (native)
- Termux (Android) - use --portable flag
