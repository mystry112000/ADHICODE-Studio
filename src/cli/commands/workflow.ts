import { UI } from "../ui"
import { listWorkflows, runWorkflow, type WorkflowName } from "../workflows/registry"

export async function workflow(name?: string, listFlag = false) {
  if (listFlag || !name) {
    UI.info("Available Workflows:")
    UI.divider()
    await listWorkflows()
    return
  }

  await runWorkflow(name as WorkflowName)
}
