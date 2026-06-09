import { UI } from "./cli/ui"
import { registerCodeTools } from "./cli/tools/code-tools"
import { registerSystemTools } from "./cli/tools/system-tools"
import { registerWebTools } from "./cli/tools/web-tools"
import { registerDevopsTools } from "./cli/tools/devops-tools"
import { registerFullstackTools } from "./cli/tools/fullstack-tools"
import { PlatformAdapter } from "./platform/adapter"

let toolCount = 0

export async function boot() {
  UI.banner()
  UI.info("Initializing ADHICODE Studio...")

  await PlatformAdapter.init()

  UI.info("Loading tools...")
  registerCodeTools()
  registerSystemTools()
  registerWebTools()
  registerDevopsTools()
  registerFullstackTools()

  const { getAllTools } = await import("./cli/tools/registry")
  toolCount = getAllTools().length

  const { getAllSkills } = await import("./cli/tools/skills")
  const skillCount = getAllSkills().length
  UI.success(`Loaded ${toolCount} tools and ${skillCount} skills`)
  UI.info("Type 'adhicode-studio --help' for usage")
  UI.divider()
}

export function getToolCount() { return toolCount }
