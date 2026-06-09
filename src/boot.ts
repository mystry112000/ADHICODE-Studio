import { UI } from "./cli/ui"
import { registerCodeTools } from "./cli/tools/code-tools"
import { registerSystemTools } from "./cli/tools/system-tools"
import { registerWebTools } from "./cli/tools/web-tools"
import { registerDevopsTools } from "./cli/tools/devops-tools"
import { PlatformAdapter } from "./platform/adapter"

export async function boot() {
  UI.banner()
  UI.info("Initializing ADHICODE Studio...")

  await PlatformAdapter.init()

  UI.info("Loading tools...")
  registerCodeTools()
  registerSystemTools()
  registerWebTools()
  registerDevopsTools()

  const { getAllTools } = await import("./cli/tools/registry")
  const toolCount = getAllTools().length

  UI.success(`Loaded ${toolCount} tools and 6 skills`)
  UI.info("Type 'adhicode-studio --help' for usage")
  UI.divider()
}
