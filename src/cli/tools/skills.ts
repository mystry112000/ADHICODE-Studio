import { UI } from "../ui"

interface Skill {
  name: string
  description: string
  category: string
  run: () => Promise<void>
}

const skills: Map<string, Skill> = new Map()

function register(skill: Skill) {
  skills.set(skill.name, skill)
}

register({
  name: "code-review",
  description: "AI-powered code review with best practices",
  category: "development",
  run: async () => {
    UI.info("Code Review Skill - Analyzing your code...")
    UI.divider()
    console.log("  Reviews code for:")
    console.log("  • Security vulnerabilities")
    console.log("  • Performance issues")
    console.log("  • Code style violations")
    console.log("  • Best practices")
    console.log("  • Potential bugs")
    UI.divider()
    UI.info("Run with: run review <file>")
  },
})

register({
  name: "project-init",
  description: "Initialize a new project with templates",
  category: "development",
  run: async () => {
    UI.info("Project Initialization Skill")
    UI.divider()
    console.log("  Available templates:")
    console.log("  • web     - React + Vite + Tailwind")
    console.log("  • api     - Bun + Hono API server")
    console.log("  • cli     - Bun CLI tool")
    console.log("  • mobile  - React Native (Expo)")
    console.log("  • lib     - TypeScript library")
    UI.divider()
    UI.info("Usage coming in next update!")
  },
})

register({
  name: "terminal-pro",
  description: "Enhanced terminal with tabs, themes, split panes",
  category: "terminal",
  run: async () => {
    UI.info("Terminal Pro Skill")
    UI.divider()
    console.log("  Features:")
    console.log("  • Tabbed terminal interface")
    console.log("  • Multiple themes (hacker, matrix, dark, light)")
    console.log("  • Split panes (horizontal/vertical)")
    console.log("  • Command history with search")
    console.log("  • SSH connection manager")
    console.log("  • Session persistence")
    UI.divider()
    UI.info("Launch with: terminal")
  },
})

register({
  name: "termux-optimize",
  description: "Optimize ADHICODE for Termux Android environment",
  category: "platform",
  run: async () => {
    UI.info("Termux Optimization Skill")
    UI.divider()
    console.log("  Applies Termux-specific settings:")
    console.log("  • Optimizes terminal UI for mobile screens")
    console.log("  • Configures SSH for Android")
    console.log("  • Sets up storage access")
    console.log("  • Configures notification integration")
    console.log("  • Battery-optimized background mode")
    UI.divider()
    UI.info("Run with: terminal --portable")
  },
})

register({
  name: "voice-control",
  description: "Voice control integration with Jarvis",
  category: "ai",
  run: async () => {
    UI.info("Voice Control Skill")
    UI.divider()
    console.log("  Integrates with Jarvis voice assistant:")
    console.log("  • Wake word detection ('jarvis')")
    console.log("  • Voice commands for tools and workflows")
    console.log("  • Text-to-speech responses")
    console.log("  • Hands-free operation")
    UI.divider()
    UI.info("Launch with: jarvis")
  },
})

register({
  name: "workflow-designer",
  description: "Design and create custom workflows",
  category: "automation",
  run: async () => {
    UI.info("Workflow Designer Skill")
    UI.divider()
    console.log("  Create custom automation workflows:")
    console.log("  • Trigger-based (file change, schedule, webhook)")
    console.log("  • Multi-step pipelines")
    console.log("  • Conditional branching")
    console.log("  • AI-powered decisions")
    UI.divider()
    UI.info("Run with: workflow")
  },
})

export async function listSkills() {
  const cats = new Map<string, Skill[]>()
  for (const s of skills.values()) {
    const cat = cats.get(s.category) ?? []
    cat.push(s)
    cats.set(s.category, cat)
  }
  for (const [cat, catSkills] of cats) {
    console.log(`  ${UI.color("bold", cat.toUpperCase())}`)
    for (const s of catSkills) {
      console.log(`    ${UI.color("green", s.name.padEnd(20))} ${s.description}`)
    }
    console.log()
  }
}

export async function runSkill(name: string) {
  const skill = skills.get(name)
  if (!skill) {
    UI.error(`Skill '${name}' not found. Run 'skills list' to see available skills.`)
    return
  }
  await skill.run()
}
