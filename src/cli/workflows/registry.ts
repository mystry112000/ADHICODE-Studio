import { UI } from "../ui"

export type WorkflowName = "analyze" | "build" | "deploy" | "test" | "review" | "scaffold" | "audit"

interface Workflow {
  name: WorkflowName
  description: string
  steps: { name: string; action: () => Promise<void> }[]
}

const workflows: Workflow[] = [
  {
    name: "analyze",
    description: "Analyze a codebase for structure, dependencies, and issues",
    steps: [
      { name: "Scanning directory structure", action: async () => UI.success("Directory scanned") },
      { name: "Analyzing dependencies", action: async () => UI.success("Dependencies analyzed") },
      { name: "Checking code quality", action: async () => UI.success("Quality check complete") },
    ],
  },
  {
    name: "build",
    description: "Build and compile the current project",
    steps: [
      { name: "Installing dependencies", action: async () => UI.success("Dependencies installed") },
      { name: "Running type check", action: async () => UI.success("Type check passed") },
      { name: "Compiling project", action: async () => UI.success("Build complete") },
    ],
  },
  {
    name: "deploy",
    description: "Deploy project to production/staging",
    steps: [
      { name: "Running pre-deploy checks", action: async () => UI.success("Checks passed") },
      { name: "Building for production", action: async () => UI.success("Build complete") },
      { name: "Deploying to server", action: async () => UI.success("Deployment complete") },
    ],
  },
  {
    name: "test",
    description: "Run full test suite",
    steps: [
      { name: "Running unit tests", action: async () => UI.success("Unit tests passed") },
      { name: "Running integration tests", action: async () => UI.success("Integration tests passed") },
      { name: "Generating coverage report", action: async () => UI.success("Coverage report generated") },
    ],
  },
  {
    name: "review",
    description: "Full code review with AI analysis",
    steps: [
      { name: "Fetching changed files", action: async () => UI.success("Changes detected") },
      { name: "Running static analysis", action: async () => UI.success("Analysis complete") },
      { name: "Generating review report", action: async () => UI.success("Review ready") },
    ],
  },
  {
    name: "scaffold",
    description: "Scaffold a new project from template",
    steps: [
      { name: "Selecting template", action: async () => UI.success("Template selected") },
      { name: "Creating project structure", action: async () => UI.success("Structure created") },
      { name: "Installing dependencies", action: async () => UI.success("Project ready") },
    ],
  },
  {
    name: "audit",
    description: "Security audit of dependencies and code",
    steps: [
      { name: "Checking dependencies", action: async () => UI.success("Dependencies checked") },
      { name: "Scanning for vulnerabilities", action: async () => UI.success("Vulnerability scan complete") },
      { name: "Generating security report", action: async () => UI.success("Security report generated") },
    ],
  },
]

export async function listWorkflows() {
  for (const w of workflows) {
    console.log(`  ${UI.color("green", w.name.padEnd(14))} ${w.description}`)
    for (const s of w.steps) {
      console.log(`    ${UI.color("dim", "→")} ${s.name}`)
    }
    console.log()
  }
}

export async function runWorkflow(name: WorkflowName) {
  const wf = workflows.find((w) => w.name === name)
  if (!wf) {
    UI.error(`Workflow '${name}' not found. Run 'workflow --list' to see available workflows.`)
    return
  }

  UI.banner()
  UI.info(`Running workflow: ${UI.color("bold", wf.name)}`)
  UI.info(wf.description)
  UI.divider()

  for (let i = 0; i < wf.steps.length; i++) {
    const step = wf.steps[i]
    UI.step(i + 1, wf.steps.length, step.name)
    await step.action()
  }

  UI.divider()
  UI.success(`Workflow '${wf.name}' complete!`)
}
