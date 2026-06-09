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
  description: "Scaffold full-stack projects (React, API, CLI, mobile)",
  category: "development",
  run: async () => {
    UI.info("Project Initialization Skill")
    UI.divider()
    console.log("  Available templates:")
    console.log("  • fullstack  - React + Hono API + DB + Docker")
    console.log("  • web        - React + Vite + TailwindCSS")
    console.log("  • api        - Bun + Hono + Drizzle ORM")
    console.log("  • cli        - Bun CLI tool with yargs")
    console.log("  • mobile     - React Native (Expo)")
    console.log("  • lib        - TypeScript library")
    console.log("  • nextapp    - Next.js full-stack app")
    console.log("  • express    - Express.js API server")
    console.log()
    UI.info("Usage: run scaffold <type> <name>")
  },
})

register({
  name: "terminal-pro",
  description: "Enhanced terminal with tabs, themes, split panes, history",
  category: "terminal",
  run: async () => {
    UI.info("Terminal Pro Skill")
    UI.divider()
    console.log("  Features:")
    console.log("  • Tabbed terminal interface")
    console.log("  • Multiple themes (hacker, matrix, dark, light, amber)")
    console.log("  • Split panes (horizontal/vertical)")
    console.log("  • Command history with fuzzy search")
    console.log("  • SSH connection manager with saved hosts")
    console.log("  • Session persistence across restarts")
    console.log("  • Tab completion for all commands")
    console.log("  • Built-in AI assistant (Ctrl+A)")
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
    console.log("  • Touch-friendly command palette")
    console.log("  • Gesture controls (swipe, pinch)")
    UI.divider()
    UI.info("Run with: terminal --portable")
  },
})

register({
  name: "voice-control",
  description: "Voice control integration with Jarvis AI",
  category: "ai",
  run: async () => {
    UI.info("Voice Control Skill")
    UI.divider()
    console.log("  Full voice control integration:")
    console.log("  • Wake word detection ('jarvis' / 'hey adhicode')")
    console.log("  • Voice commands for all tools and workflows")
    console.log("  • Text-to-speech responses with multiple voices")
    console.log("  • Hands-free operation mode")
    console.log("  • Custom voice command mapping")
    console.log("  • Multi-language support")
    UI.divider()
    UI.info("Launch with: jarvis")
  },
})

register({
  name: "workflow-designer",
  description: "Design, create and automate custom workflows",
  category: "automation",
  run: async () => {
    UI.info("Workflow Designer Skill")
    UI.divider()
    console.log("  Create custom automation workflows:")
    console.log("  • Trigger-based (file change, schedule, webhook, git push)")
    console.log("  • Multi-step pipelines with branching")
    console.log("  • Conditional logic and error handling")
    console.log("  • AI-powered decision nodes")
    console.log("  • Parallel execution")
    console.log("  • Integration with GitHub Actions, Docker, cloud")
    console.log("  • Export as YAML/JSON")
    UI.divider()
    console.log("  Pre-built templates: CI/CD, deploy, test, review, audit")
    UI.info("Run with: workflow")
  },
})

register({
  name: "fullstack-dev",
  description: "Full-stack development toolkit (React, API, DB, deploy)",
  category: "development",
  run: async () => {
    UI.info("Full-Stack Development Skill")
    UI.divider()
    console.log("  Complete full-stack toolkit:")
    console.log("  • React component generator (run react <Name>)")
    console.log("  • API endpoint generator (run api <name>)")
    console.log("  • Database migration generator (run db-migrate <name>)")
    console.log("  • Docker setup (run docker-compose)")
    console.log("  • TailwindCSS setup (run tailwind)")
    console.log("  • GitHub Actions CI/CD (run github-actions ci|deploy)")
    console.log("  • Web search (run websearch <query>)")
    console.log("  • Project snapshots (run restore <name>)")
    UI.divider()
    UI.info("Full-stack templates coming in next update!")
  },
})

register({
  name: "database-pro",
  description: "Database management and migration tools",
  category: "data",
  run: async () => {
    UI.info("Database Pro Skill")
    UI.divider()
    console.log("  Database capabilities:")
    console.log("  • Generate SQL migrations")
    console.log("  • PostgreSQL/MySQL/SQLite support")
    console.log("  • Drizzle ORM integration")
    console.log("  • Seed data generation")
    console.log("  • Backup and restore")
    console.log("  • Query optimization")
    UI.divider()
    UI.info("Run with: run db-migrate <name>")
  },
})

register({
  name: "security-audit",
  description: "Security scanning and vulnerability assessment",
  category: "security",
  run: async () => {
    UI.info("Security Audit Skill")
    UI.divider()
    console.log("  Security capabilities:")
    console.log("  • Dependency vulnerability scanning")
    console.log("  • Code security analysis")
    console.log("  • OWASP top 10 checks")
    console.log("  • Secret/key exposure detection")
    console.log("  • CORS and headers audit")
    console.log("  • Rate limiting configuration")
    UI.divider()
    UI.info("Run with: workflow audit")
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
      console.log(`    ${UI.color("green", s.name.padEnd(22))} ${s.description}`)
    }
    console.log()
  }
}

export async function runSkill(name: string) {
  const skill = skills.get(name)
  if (!skill) {
    UI.error(`Skill '${name}' not found. Run 'skills' to see available skills.`)
    return
  }
  await skill.run()
}

export function getAllSkills() {
  return Array.from(skills.values())
}
