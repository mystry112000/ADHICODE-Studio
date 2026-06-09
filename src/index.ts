#!/usr/bin/env bun
import { UI } from "./cli/ui"
import { pkg } from "./pkg"
import { boot } from "./boot"

const cmd = process.argv[2]
const args = process.argv.slice(3)

async function main() {
  if (cmd === "completions" || cmd === "--completions") {
    const { bashCompletions, psCompletions } = await import("./completions/scripts")
    console.log(args[0] === "bash" ? bashCompletions : psCompletions)
    process.exit(0)
  }

  await boot()

  switch (cmd) {
    case "tools":
      const { listTools } = await import("./cli/tools/registry")
      await listTools()
      break
    case "run":
      const { runTool } = await import("./cli/tools/registry")
      await runTool(args[0], args.slice(1))
      break
    case "jarvis":
      const { jarvis } = await import("./cli/commands/jarvis")
      await jarvis(args.join(" "))
      break
    case "terminal":
      const { terminal } = await import("./cli/commands/terminal")
      await terminal({ portable: args.includes("--portable") })
      break
    case "workflow":
      const { workflow } = await import("./cli/commands/workflow")
      await workflow(args[0], args.includes("--list"))
      break
    case "server":
      const { server } = await import("./cli/commands/server")
      const portIdx = args.indexOf("--port")
      await server({
        port: portIdx >= 0 ? parseInt(args[portIdx + 1] ?? "4096") : 4096,
        web: args.includes("--web"),
      })
      break
    case "ai":
      const { ai } = await import("./cli/commands/ai")
      const modelIdx = args.indexOf("--model")
      const agentIdx = args.indexOf("--agent")
      await ai({
        message: args.filter((a) => !a.startsWith("--")).join(" "),
        model: modelIdx >= 0 ? args[modelIdx + 1] : undefined,
        agent: agentIdx >= 0 ? args[agentIdx + 1] : undefined,
      })
      break
    case "skills":
      const { listSkills } = await import("./cli/tools/skills")
      await listSkills()
      break
    case "skill":
      const { runSkill } = await import("./cli/tools/skills")
      await runSkill(args[0])
      break
    case "config":
      const { showConfig } = await import("./cli/commands/config")
      await showConfig()
      break
    case "config-set":
      const { setConfig } = await import("./cli/commands/config")
      await setConfig(args[0], args.slice(1).join(" "))
      break
    case "--help":
    case "-h":
      showHelp()
      break
    case "--version":
    case "-v":
      console.log(pkg.version)
      break
    default:
      if (cmd) {
        console.error(`Unknown command: ${cmd}`)
        console.log()
      }
      showHelp()
      process.exit(1)
  }
}

function showHelp() {
  console.log()
  console.log(`  ${UI.color("bold", "ADHICODE Studio")} ${UI.color("dim", `v${pkg.version}`)}`)
  console.log()
  console.log("  Usage: adhicode-studio <command> [options]")
  console.log()
  console.log("  Commands:")
  console.log(`    ${UI.color("green", "tools")}           List all built-in tools`)
  console.log(`    ${UI.color("green", "run <tool>")}      Run a specific tool`)
  console.log(`    ${UI.color("green", "skills")}          List all built-in skills`)
  console.log(`    ${UI.color("green", "skill <name>")}    Run a specific skill`)
  console.log(`    ${UI.color("green", "workflow")}        List all workflows`)
  console.log(`    ${UI.color("green", "workflow <name>")} Run a workflow`)
  console.log(`    ${UI.color("green", "jarvis")}          Launch Jarvis AI voice assistant`)
  console.log(`    ${UI.color("green", "terminal")}        Launch built-in terminal emulator`)
  console.log(`    ${UI.color("green", "server")}          Start API server`)
  console.log(`    ${UI.color("green", "ai <msg>")}        Ask AI directly`)
  console.log(`    ${UI.color("green", "config")}          Show configuration`)
    console.log(`    ${UI.color("green", "config-set <k> <v>")} Set configuration`)
    console.log(`    ${UI.color("green", "completions")}      Generate shell completion script (use: completions powershell/bash)`)
  console.log()
  console.log("  Templates: fullstack, frontend, backend")
  console.log(`    ${UI.color("green", "run scaffold <template> <name>")} Generate a full project`)
  console.log()
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
