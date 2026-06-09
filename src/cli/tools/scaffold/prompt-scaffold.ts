import { UI } from "../../ui"
import { getTemplate, templates } from "./index"
import { writeProject } from "./templates"

interface ParsedPrompt {
  template: string
  projectName: string
  description: string
}

const keywordMap: Record<string, string[]> = {
  fullstack: ["fullstack", "full stack", "monorepo", "full-stack", "frontend and backend", "both", "complete"],
  frontend: ["frontend", "front-end", "front end", "ui", "react", "vue", "svelte", "vite", "spa", "landing", "website"],
  backend: ["backend", "back-end", "back end", "api", "server", "rest", "graphql", "hono", "express", "drizzle"],
}

function inferTemplate(prompt: string): string {
  const lower = prompt.toLowerCase()

  let scores: Record<string, number> = { fullstack: 0, frontend: 0, backend: 0 }

  for (const [template, keywords] of Object.entries(keywordMap)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        if (kw === "both" || kw === "complete" || kw === "fullstack" || kw === "full stack" || kw === "full-stack") {
          scores.fullstack += 3
        }
        if (kw === "api" || kw === "server" || kw === "rest" || kw === "hono" || kw === "drizzle") {
          scores.backend += 2
        }
        if (kw === "react" || kw === "vue" || kw === "ui" || kw === "frontend" || kw === "vite") {
          scores.frontend += 2
        }
        scores[template] += 1
      }
    }
  }

  const hasFrontend = ["react", "vue", "svelte", "ui", "frontend", "front-end", "spa", "landing", "website", "vite"].some(k => lower.includes(k))
  const hasBackend = ["api", "backend", "back-end", "server", "rest", "graphql", "hono", "express", "drizzle", "database", "db"].some(k => lower.includes(k))

  if (hasFrontend && hasBackend) return "fullstack"
  if (hasBackend) return "backend"
  if (hasFrontend) return "frontend"

  if (scores.fullstack >= scores.frontend && scores.fullstack >= scores.backend && scores.fullstack > 0) return "fullstack"
  if (scores.frontend >= scores.backend) return "frontend"

  return "fullstack"
}

function extractProjectName(prompt: string): string {
  const lower = prompt.toLowerCase()

  const namePatterns = [
    /(?:called|named|project\s*name(?:\s*is)?)\s+["']?(\w[\w-]*)["']?/i,
    /create\s+(?:a|an|the)\s+(\w[\w-]*)/i,
    /build\s+(?:a|an|the)\s+(\w[\w-]*)/i,
    /make\s+(?:a|an|the)\s+(\w[\w-]*)/i,
  ]

  for (const pattern of namePatterns) {
    const match = prompt.match(pattern)
    if (match && !["blog", "app", "website", "site", "web", "api", "project", "fullstack", "frontend", "backend", "landing", "page", "portfolio", "dashboard", "ui", "component"].includes(match[1].toLowerCase())) {
      return match[1].toLowerCase().replace(/[^a-z0-9-]/g, "-")
    }
  }

  return extractNameFromDescription(prompt)
}

function extractNameFromDescription(prompt: string): string {
  const stopWords = ["create", "build", "make", "a", "an", "the", "with", "using", "for", "in", "and", "that", "this", "have", "has", "can", "will", "should"]
  const words = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w))

  if (words.length === 0) return "my-app"

  if (words.length <= 3) return words.join("-")

  const meaningful = words.filter(w => !["react", "vue", "angular", "svelte", "tailwind", "tailwindcss", "node", "bun", "hono", "express", "next", "nuxt", "typescript", "javascript", "frontend", "backend", "api", "fullstack", "database", "css", "html", "js", "ts", "with", "using", "app"].includes(w))

  if (meaningful.length > 0) {
    return meaningful.slice(0, 3).join("-")
  }

  return words[0]
}

function extractDescription(prompt: string): string {
  const cleaned = prompt.replace(/(?:create|build|make|generate|scaffold)\s+(?:a|an|the|me|new)\s*/i, "").trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export function parsePrompt(prompt: string): ParsedPrompt {
  return {
    template: inferTemplate(prompt),
    projectName: extractProjectName(prompt),
    description: extractDescription(prompt),
  }
}

export async function runPromptScaffold(prompt: string) {
  UI.info(`Analyzing: "${prompt}"`)
  UI.divider()

  const parsed = parsePrompt(prompt)
  UI.info(`Detected: ${UI.color("bold", parsed.template.toUpperCase())} → project "${parsed.projectName}"`)
  UI.info(`Description: ${parsed.description}`)
  UI.divider()

  const template = getTemplate(parsed.template)
  if (!template) {
    UI.error(`No matching template found for '${parsed.template}'`)
    return
  }

  const root = await writeProject(template, parsed.projectName, process.cwd())
  UI.success(`Project '${parsed.projectName}' created at ${root}`)

  // Customize the App name in the generated files (replace placeholder with real description)
  const { readFile, writeFile } = await import("node:fs/promises")
  const { join } = await import("node:path")

  const appFiles: string[] = []
  const fs = await import("node:fs")
  const walkDir = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walkDir(full)
      else if (entry.name === "App.tsx" || entry.name === "index.ts") appFiles.push(full)
    }
  }
  walkDir(root)

  // Derive a nice title from the description
  const title = parsed.description.length > 30
    ? parsed.description.substring(0, 30) + "..."
    : parsed.description

  UI.divider()
  console.log("  Next steps:")
  console.log(`    cd ${parsed.projectName}`)
  console.log("    bun install")
  console.log("    bun run dev")
  UI.divider()
}
