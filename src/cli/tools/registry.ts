import { UI } from "../ui"

export interface Tool {
  name: string
  description: string
  category: "code" | "system" | "web" | "data" | "devops" | "ai" | "utility"
  run: (args: string[]) => Promise<void> | void
}

const tools: Map<string, Tool> = new Map()

export function registerTool(tool: Tool) {
  tools.set(tool.name, tool)
}

export function getTool(name: string): Tool | undefined {
  return tools.get(name)
}

export function getAllTools(): Tool[] {
  return Array.from(tools.values())
}

export async function listTools() {
  const all = getAllTools()
  const categories = new Map<string, Tool[]>()

  for (const tool of all) {
    const cat = categories.get(tool.category) ?? []
    cat.push(tool)
    categories.set(tool.category, cat)
  }

  for (const [cat, catTools] of categories) {
    console.log(`  ${UI.color("bold", cat.toUpperCase())}`)
    for (const t of catTools) {
      console.log(`    ${UI.color("green", t.name.padEnd(16))} ${t.description}`)
    }
    console.log()
  }
}

export async function runTool(name: string, args: string[]) {
  const tool = getTool(name)
  if (!tool) {
    UI.error(`Tool '${name}' not found. Run 'tools list' to see available tools.`)
    return
  }
  UI.info(`Running tool: ${tool.name}`)
  UI.divider()
  try {
    await tool.run(args)
  } catch (e) {
    UI.error(`Tool '${name}' failed: ${(e as Error).message}`)
  }
}
