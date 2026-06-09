import { registerTool } from "./registry"
import { execSync, spawnSync } from "child_process"
import { UI } from "../ui"
import { templates, getTemplate, listTemplates } from "./scaffold"

export function registerFullstackTools() {
  registerTool({
    name: "websearch",
    description: "Search the web via DuckDuckGo",
    category: "fullstack",
    run: async (args) => {
      const query = args.join(" ")
      if (!query) { UI.error("Usage: run websearch <query>"); return }
      UI.info(`Searching for: ${query}`)
      try {
        const resp = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`)
        const data = await resp.json() as { AbstractText?: string; RelatedTopics?: { Text?: string }[] }
        if (data.AbstractText) console.log(`  ${data.AbstractText}`)
        else if (data.RelatedTopics?.length) {
          data.RelatedTopics.slice(0, 5).forEach((t) => {
            if (t.Text) console.log(`  • ${t.Text}`)
          })
        } else UI.warn("No results found")
      } catch { UI.error("Search failed") }
    },
  })

  registerTool({
    name: "react",
    description: "Create a React component boilerplate",
    category: "fullstack",
    run: async (args) => {
      const name = args[0]
      if (!name) { UI.error("Usage: run react <ComponentName>"); return }
      const tsx = `import { ${name}Props } from "./types"\n\nexport function ${name}({}: ${name}Props) {\n  return (\n    <div className="${name.toLowerCase()}">\n      <h1>${name}</h1>\n    </div>\n  )\n}\n`
      const file = `${name}.tsx`
      await Bun.write(file, tsx)
      UI.success(`Created ${file}`)
    },
  })

  registerTool({
    name: "api",
    description: "Create a REST API endpoint boilerplate",
    category: "fullstack",
    run: async (args) => {
      const name = args[0] || "api"
      const ts = `import { Hono } from "hono"\n\nconst app = new Hono()\n\napp.get("/${name}", (c) => c.json({ message: "${name} endpoint" }))\napp.post("/${name}", async (c) => {\n  const body = await c.req.json()\n  return c.json({ received: body })\n})\n\nexport default app\n`
      const file = `${name}.ts`
      await Bun.write(file, ts)
      UI.success(`Created ${file}`)
    },
  })

  registerTool({
    name: "db-migrate",
    description: "Generate a database migration template",
    category: "fullstack",
    run: async (args) => {
      const name = args.join("_") || "migration"
      const sql = `-- Migration: ${name}\n-- Created: ${new Date().toISOString()}\n\nBEGIN;\n\n-- Add your SQL here\n\nCOMMIT;\n`
      const file = `migrations/${Date.now()}_${name}.sql`
      await Bun.write(file, sql)
      UI.success(`Created ${file}`)
    },
  })

  registerTool({
    name: "docker-compose",
    description: "Generate docker-compose.yml for full-stack app",
    category: "fullstack",
    run: async (args) => {
      const yml = `version: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n    depends_on:\n      - db\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: app\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:\n`
      await Bun.write("docker-compose.yml", yml)
      UI.success("Created docker-compose.yml")
    },
  })

  registerTool({
    name: "tailwind",
    description: "Generate TailwindCSS config",
    category: "fullstack",
    run: async () => {
      const config = `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ["./src/**/*.{ts,tsx}", "./index.html"],\n  theme: { extend: {} },\n  plugins: [],\n}\n`
      await Bun.write("tailwind.config.ts", config)
      const css = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
      await Bun.write("src/index.css", css)
      UI.success("Created TailwindCSS config + CSS")
    },
  })

  registerTool({
    name: "github-actions",
    description: "Generate GitHub Actions CI/CD workflow",
    category: "fullstack",
    run: async (args) => {
      const type = args[0] || "ci"
      const workflows: Record<string, string> = {
        ci: `name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm test\n`,
        deploy: `name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n      - run: echo "Deploy here"\n`,
      }
      const content = workflows[type] || workflows.ci
      await Bun.write(".github/workflows/main.yml", content)
      UI.success(`Created .github/workflows/main.yml (${type})`)
    },
  })

  registerTool({
    name: "restore",
    description: "Create a restore point / snapshot of current project",
    category: "fullstack",
    run: async (args) => {
      const name = args.join("-") || `snapshot-${Date.now()}`
      const dir = `.snapshots/${name}`
      execSync(`mkdir "${dir}" 2>nul || mkdir -p "${dir}"`, { stdio: "ignore" })
      execSync(`copy package.json "${dir}/" 2>nul || cp package.json "${dir}/"`, { stdio: "ignore" })
      execSync(`copy bun.lock "${dir}/" 2>nul || cp bun.lock "${dir}/"`, { stdio: "ignore" })
      UI.success(`Snapshot saved to ${dir}/`)
    },
  })

  registerTool({
    name: "scaffold",
    description: "Scaffold a full-stack/frontend/backend project from template",
    category: "fullstack",
    run: async (args) => {
      const templateName = args[0]
      const projectName = args[1]

      if (!templateName || templateName === "--list") {
        listTemplates()
        return
      }

      if (!projectName) {
        UI.error("Usage: run scaffold <template> <project-name>")
        return
      }

      const template = getTemplate(templateName)
      if (!template) {
        UI.error(`Template '${templateName}' not found.`)
        listTemplates()
        return
      }

      const { writeProject } = await import("./scaffold/templates")
      const root = await writeProject(template, projectName, process.cwd())
      UI.success(`Project '${projectName}' created at ${root}`)
      UI.divider()
      console.log("  Next steps:")
      console.log(`    cd ${projectName}`)
      if (templateName === "fullstack") {
        console.log("    bun install")
        console.log("    bun run dev")
      } else if (templateName === "frontend") {
        console.log("    bun install")
        console.log("    bun run dev")
      } else if (templateName === "backend") {
        console.log("    bun install")
        console.log("    bun run dev")
      }
      UI.divider()
    },
  })
}
