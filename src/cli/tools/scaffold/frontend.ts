import { Template, TemplateFile } from "./templates"

function json(o: Record<string, unknown>) {
  return JSON.stringify(o, null, 2)
}

function css(strings: TemplateStringsArray, ...vals: unknown[]) {
  return String.raw(strings, ...vals)
}

function tsx(strings: TemplateStringsArray, ...vals: unknown[]) {
  return String.raw(strings, ...vals)
}

export const frontendTemplate: Template = {
  name: "frontend",
  description: "React + Vite + TypeScript + TailwindCSS v4 frontend only",
  category: "frontend",
  generate: (name: string) => {
    const files: TemplateFile[] = []

    files.push({
      path: "package.json",
      content: json({
        name,
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc -b && vite build",
          preview: "vite preview",
          test: "vitest run",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "@tanstack/react-router": "^1.0.0",
          "@tanstack/react-query": "^5.0.0",
          zustand: "^5.0.0",
          "react-hook-form": "^7.0.0",
          zod: "^4.0.0",
        },
        devDependencies: {
          typescript: "^5.7.0",
          vite: "^7.0.0",
          "@vitejs/plugin-react": "^4.0.0",
          tailwindcss: "^4.0.0",
          "@tailwindcss/vite": "^4.0.0",
          vitest: "^3.0.0",
          "@testing-library/react": "^16.0.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
        },
      }),
    })

    files.push({
      path: "index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    })

    files.push({
      path: "vite.config.ts",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 3000 },
})`,
    })

    files.push({
      path: "tsconfig.json",
      content: json({
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
      }),
    })

    files.push({
      path: "src/index.css",
      content: css`@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-accent: #06b6d4;
  --color-surface: #0f172a;
  --color-card: #1e293b;
  --color-muted: #94a3b8;
  --font-sans: 'Inter', system-ui, sans-serif;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
  50% { box-shadow: 0 0 40px rgba(99,102,241,0.6); }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }

body {
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: #f1f5f9;
}`,
    })

    files.push({
      path: "src/main.tsx",
      content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)`,
    })

    const appTsxBkticks = "`"
    const appTsxDollarBrace = "${"

    files.push({
      path: "src/App.tsx",
      content: tsx`import { useState, useEffect } from 'react'

const techs = [
  { name: 'React 19', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { name: 'Vite', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { name: 'Tailwind v4', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'TypeScript', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
]

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Vite HMR for instant updates' },
  { icon: '🎨', title: 'Beautiful UI', desc: 'TailwindCSS v4 with custom theme' },
  { icon: '🔒', title: 'Type Safe', desc: 'Full TypeScript strict mode' },
  { icon: '📦', title: 'Optimized', desc: 'Automatic code splitting' },
]

export default function App() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s' }}>
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            New project scaffolded
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ${name}
            </span>
          </h1>

          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Built with modern stack. Fast by default. Ready to ship.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {techs.map((t) => (
              <span key={t.name} className={${appTsxDollarBrace}t.color${appTsxBkticks}}>
                {t.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-xl bg-card border border-slate-700/50 hover:border-primary/30 transition-all duration-300"
              style={{ animation: mounted ? ${appTsxDollarBrace}i * 0.1}s forwards${appTsxBkticks} : 'none', opacity: 0 }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-muted text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex gap-4">
            <a href="#" className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium hover:opacity-90 transition-all animate-pulse-glow">
              Get Started
            </a>
            <a href="#" className="px-8 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:border-primary/50 hover:text-white transition-all">
              Learn More \u2192
            </a>
          </div>
        </div>

        <div className="mt-32 text-center text-sm text-muted">
          <p>Generated with ADHICODE Studio &mdash; edit <code className="text-primary">src/App.tsx</code> to get started</p>
        </div>
      </div>
    </div>
  )
}`,
    })

    files.push({
      path: "src/vite-env.d.ts",
      content: `/// <reference types="vite/client" />`,
    })

    files.push({
      path: "public/favicon.svg",
      content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#6366f1"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold">A</text></svg>`,
    })

    files.push({ path: ".gitignore", content: "node_modules\ndist\n.env\n" })

    return files
  },
}
