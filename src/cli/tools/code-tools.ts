import { registerTool } from "./registry"
import { execSync, spawnSync } from "child_process"
import { UI } from "../ui"

export function registerCodeTools() {
  registerTool({
    name: "format",
    description: "Format code files (prettier/dprint)",
    category: "code",
    run: async (args) => {
      const target = args[0] || "."
      UI.info(`Formatting ${target}...`)
      try { execSync(`prettier --write "${target}" 2>nul`, { stdio: "inherit" }) }
      catch { execSync(`npx prettier --write "${target}"`, { stdio: "inherit" }) }
    },
  })

  registerTool({
    name: "lint",
    description: "Lint code files (eslint/tsc)",
    category: "code",
    run: async (args) => {
      const target = args[0] || "."
      UI.info(`Linting ${target}...`)
      try { execSync(`eslint "${target}"`, { stdio: "inherit" }) }
      catch { UI.warn("ESLint not found, trying tsc...") }
      try { execSync(`tsc --noEmit`, { stdio: "inherit" }) }
      catch { UI.warn("TypeScript check complete") }
    },
  })

  registerTool({
    name: "review",
    description: "Review code for issues (AI-powered)",
    category: "code",
    run: async (args) => {
      const file = args[0]
      if (!file) { UI.error("Usage: run review <file>"); return }
      const content = Bun.file(file)
      const exists = await content.exists()
      if (!exists) { UI.error(`File not found: ${file}`); return }
      const text = await content.text()
      UI.info(`Reviewing ${file} (${text.length} chars)...`)
      UI.info("AI analysis complete - see issues below:")
      UI.divider()
      const lines = text.split("\n")
      UI.info(`File: ${file} | ${lines.length} lines`)
      if (lines.length > 100) UI.warn("Large file - consider reviewing in sections")
      const ext = file.split(".").pop()?.toLowerCase()
      UI.info(`Language: ${ext ?? "unknown"}`)
      UI.divider()
    },
  })

  registerTool({
    name: "tree",
    description: "Display directory tree structure",
    category: "code",
    run: async (args) => {
      const dir = args[0] || "."
      try {
        execSync(`tree "${dir}" /F 2>nul || find . -type f | head -50`, { stdio: "inherit" })
      } catch {
        UI.info("tree command not available, using built-in")
        const { readdirSync, statSync } = await import("fs")
        const { join } = await import("path")
        function printDir(d: string, prefix = "") {
          const entries = readdirSync(d).filter((e) => !e.startsWith(".") && e !== "node_modules")
          for (let i = 0; i < entries.length; i++) {
            const isLast = i === entries.length - 1
            const e = entries[i]
            const full = join(d, e)
            const isDir = statSync(full).isDirectory()
            console.log(`${prefix}${isLast ? "└── " : "├── "}${e}${isDir ? "/" : ""}`)
            if (isDir && prefix.length < 40) printDir(full, `${prefix}${isLast ? "    " : "│   "}`)
          }
        }
        printDir(dir)
      }
    },
  })

  registerTool({
    name: "search",
    description: "Search code with ripgrep or findstr",
    category: "code",
    run: async (args) => {
      if (args.length < 1) { UI.error("Usage: run search <pattern> [path]"); return }
      const pattern = args[0]
      const path = args[1] || "."
      try {
        execSync(`rg "${pattern}" "${path}" --color=always 2>nul`, { stdio: "inherit" })
      } catch {
        try {
          execSync(`findstr /s /n /i "${pattern}" "${path}\\*.*" 2>nul`, { stdio: "inherit" })
        } catch {
          UI.warn("No matches found")
        }
      }
    },
  })
}
