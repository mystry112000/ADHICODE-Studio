import { registerTool } from "./registry"
import { UI } from "../ui"
import { execSync } from "child_process"

export function registerDevopsTools() {
  registerTool({
    name: "docker",
    description: "Quick Docker commands (ps, logs, images)",
    category: "devops",
    run: async (args) => {
      const sub = args[0] || "ps"
      const extra = args.slice(1).join(" ")
      try {
        execSync(`docker ${sub} ${extra}`, { stdio: "inherit" })
      } catch { UI.error("Docker command failed") }
    },
  })

  registerTool({
    name: "gitlog",
    description: "Show condensed git log",
    category: "devops",
    run: async (args) => {
      const count = args[0] || "10"
      try {
        execSync(`git log --oneline --graph --all -${count}`, { stdio: "inherit" })
      } catch { UI.error("Not a git repository") }
    },
  })

  registerTool({
    name: "deploy",
    description: "Quick deployment helpers",
    category: "devops",
    run: async (args) => {
      const target = args[0] || "."
      UI.info(`Deploying ${target}...`)
      UI.info("Choose deployment method:")
      console.log("  1. GitHub Pages")
      console.log("  2. Vercel")
      console.log("  3. Netlify")
      console.log("  4. Custom server (rsync)")
      UI.info("Run the appropriate CLI tool for your platform")
    },
  })

  registerTool({
    name: "ports",
    description: "List listening ports and processes",
    category: "devops",
    run: async () => {
      try {
        execSync("netstat -ano | findstr LISTEN 2>nul || ss -tlnp", { stdio: "inherit" })
      } catch { UI.error("Cannot list ports") }
    },
  })
}
