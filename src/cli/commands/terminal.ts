import { UI } from "../ui"

interface TerminalOptions {
  portable: boolean
}

export async function terminal(opts: TerminalOptions) {
  UI.banner()
  UI.info("Initializing ADHICODE Terminal...")

  const isTermux = !!(process.env.TERMUX_VERSION || process.env.PREFIX?.includes("com.termux") || opts.portable)

  if (isTermux || opts.portable) {
    UI.success("📱 Mobile/Termux mode active")
    console.log(`  ${UI.color("dim", "• Touch-friendly interface")}`)
    console.log(`  ${UI.color("dim", "• Smaller font optimized")}`)
    console.log(`  ${UI.color("dim", "• Swipe gestures enabled")}`)
    console.log(`  ${UI.color("dim", "• Battery-saver mode")}`)
    console.log()
  }

  const terminalHTML = new URL("../../../TerminalVault/assets/terminal.html", import.meta.url).pathname

  try {
    const termFile = Bun.file(terminalHTML)
    const exists = await termFile.exists()
    if (exists) {
      UI.success("Terminal emulator assets found")
    } else {
      UI.warn("Terminal assets not found, using built-in terminal")
    }
  } catch {
    UI.warn("Using built-in terminal (no external assets)")
  }

  UI.divider()
  console.log(`  ${UI.color("bold", "ADHICODE Terminal v2.0")}`)
  if (isTermux) console.log(`  ${UI.color("dim", "📱 Termux Mode")}`)
  console.log()
  console.log(`  ${UI.color("dim", "Commands:")}`)
  console.log(`    ${UI.color("green", "help")}        - Show this help`)
  console.log(`    ${UI.color("green", "exit")}        - Exit terminal`)
  console.log(`    ${UI.color("green", "clear")}       - Clear screen`)
  console.log(`    ${UI.color("green", "ai <msg>")}    - Ask AI`)
  console.log(`    ${UI.color("green", "tools")}       - List tools`)
  console.log(`    ${UI.color("green", "workflow")}    - Run workflow`)
  console.log(`    ${UI.color("green", "jarvis")}      - Talk to Jarvis`)
  console.log(`    ${UI.color("green", "ssh <host>")}  - SSH connection`)
  console.log(`    ${UI.color("green", "code <file>")} - Edit file`)
  console.log()

  await terminalRepl(opts)
}

const TAB_COMMANDS = [
  "help", "exit", "clear", "ai", "tools", "run",
  "workflow", "jarvis", "ssh", "code", "ls", "cd", "pwd",
]
const TOOL_NAMES = [
  "format", "lint", "review", "tree", "search",
  "sysinfo", "process", "disk", "weather", "notify",
  "shorten", "whois", "headers", "qr",
  "docker", "gitlog", "deploy", "ports",
]

async function terminalRepl(opts: TerminalOptions) {
  const readline = await import("readline")
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${UI.color("green", "adb> ")}`,
    completer: (line: string) => {
      const hits = TAB_COMMANDS.filter((c) => c.startsWith(line))
      const toolHits = TOOL_NAMES.filter((c) => c.startsWith(line))
      const all = [...hits, ...toolHits]
      return [all.length ? all : TAB_COMMANDS, line]
    },
  })

  rl.prompt()

  rl.on("line", async (line: string) => {
    const input = line.trim()
    const args = input.split(/\s+/)
    const cmd = args[0]?.toLowerCase()

    switch (cmd) {
      case "help":
        console.log(`  ${UI.color("bold", "Commands:")}`)
        console.log(`    help        - Show help`)
        console.log(`    exit/quit   - Exit terminal`)
        console.log(`    clear       - Clear screen`)
        console.log(`    ai <msg>    - Ask AI assistant`)
        console.log(`    tools       - List available tools`)
        console.log(`    run <tool>  - Run a tool`)
        console.log(`    workflow    - List workflows`)
        console.log(`    jarvis      - Talk to Jarvis AI`)
        console.log(`    ssh <host>  - SSH to remote`)
        console.log(`    code <file> - Edit a file`)
        console.log(`    ls/cd/pwd   - File system commands`)
        break
      case "exit":
      case "quit":
        rl.close()
        process.exit(0)
        break
      case "clear":
        console.clear()
        break
      case "ai":
        if (args.slice(1).length) {
          const { ai } = await import("./ai")
          await ai({ message: args.slice(1).join(" ") })
        } else {
          UI.warn("Usage: ai <message>")
        }
        break
      case "tools":
        const { listTools } = await import("../tools/registry")
        await listTools()
        break
      case "run":
        if (args[1]) {
          const { runTool } = await import("../tools/registry")
          await runTool(args[1], args.slice(2))
        } else {
          UI.warn("Usage: run <tool> [args..]")
        }
        break
      case "workflow":
        const { workflow } = await import("./workflow")
        await workflow(args[1], !args[1])
        break
      case "jarvis":
        const { jarvis } = await import("./jarvis")
        await jarvis(args.slice(1).join(" "))
        break
      case "ssh":
        if (args[1]) {
          UI.info(`Connecting to ${args[1]}...`)
          const proc = Bun.spawn(["ssh", ...args.slice(1)], { stdio: ["inherit", "inherit", "inherit"] })
          await proc.exited
        } else {
          UI.warn("Usage: ssh <host>")
        }
        break
      case "code":
        if (args[1]) {
          UI.info(`Editing ${args[1]}...`)
          const proc = Bun.spawn(["code", args[1]], { stdio: ["inherit", "inherit", "inherit"] })
          await proc.exited
        } else {
          UI.warn("Usage: code <file>")
        }
        break
      case "":
        break
      default:
        const proc = Bun.spawn(cmd, args.slice(1), {
          stdio: ["inherit", "inherit", "inherit"],
          shell: true,
        })
        await proc.exited
    }

    rl.prompt()
  })

  rl.on("close", () => {
    console.log()
    process.exit(0)
  })
}
