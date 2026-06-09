import { Template, TemplateFile } from "./templates"

function json(o: Record<string, unknown>) {
  return JSON.stringify(o, null, 2)
}

export const fullstackTemplate: Template = {
  name: "fullstack",
  description: "React + Vite + TailwindCSS v4 frontend + Bun + Hono API backend",
  category: "fullstack",
  generate: (name: string) => {
    const files: TemplateFile[] = []

    // ── Root ──
    files.push({
      path: "package.json",
      content: json({
        name,
        private: true,
        workspaces: ["apps/*", "packages/*"],
        scripts: {
          dev: "turbo dev",
          "dev:web": "turbo dev --filter=@myapp/web",
          "dev:api": "turbo dev --filter=@myapp/api",
          build: "turbo build",
          test: "turbo test",
          lint: "biome check .",
          typecheck: "turbo typecheck",
          clean: "turbo clean && rm -rf node_modules",
        },
        devDependencies: {
          turbo: "^2.0.0",
          "typescript": "^5.7.0",
        },
      }),
    })

    files.push({
      path: "turbo.json",
      content: json({
        $schema: "https://turbo.build/schema.json",
        tasks: {
          dev: { cache: false, persistent: true },
          build: { dependsOn: ["^build"], outputs: ["dist/**"] },
          test: { dependsOn: ["^build"] },
          typecheck: { dependsOn: ["^build"] },
          lint: {},
          clean: { cache: false },
        },
      }),
    })

    files.push({ path: ".gitignore", content: "node_modules\ndist\n.env\n.turbo\n" })

    // ── apps/web (React + Vite + Tailwind v4) ──
    files.push({
      path: "apps/web/package.json",
      content: json({
        name: "@myapp/web",
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
          ky: "^1.0.0",
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
      path: "apps/web/index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name} — Web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    })

    files.push({
      path: "apps/web/vite.config.ts",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:3001' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
})`,
    })

    files.push({
      path: "apps/web/tsconfig.json",
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
          noFallthroughCasesInSwitch: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
      }),
    })

    files.push({
      path: "apps/web/src/index.css",
      content: `@import "tailwindcss";

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

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }

body {
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: #f1f5f9;
}`,
    })

    files.push({
      path: "apps/web/src/main.tsx",
      content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
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

    files.push({
      path: "apps/web/src/App.tsx",
      content: `import { useState, useEffect } from 'react'
import ky from 'ky'

const api = ky.create({ prefixUrl: '/api/v1' })

interface HealthResponse { status: string; timestamp: string }
interface Item { id: number; name: string; done: boolean }

const techs = [
  { name: 'React 19', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { name: 'Vite', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { name: 'Tailwind v4', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Hono API', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { name: 'Turbo', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
]

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    api.get('health').json<HealthResponse>()
      .then(setHealth)
      .catch(() => setError('API not reachable'))
    api.get('items').json<Item[]>()
      .then(setItems)
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center space-y-6 mb-16" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s' }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {name}
            </span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">Full-stack app — frontend + API running</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {techs.map((t) => (
              <span key={t.name} className={\`px-4 py-1.5 rounded-full border text-sm font-medium \${t.color}\`}>{t.name}</span>
            ))}
          </div>
        </div>

        {/* Status + Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* API Health Card */}
          <div className="p-6 rounded-xl bg-card border border-slate-700/50 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">API Status</h2>
              <span className={\`w-3 h-3 rounded-full \${health ? 'bg-green-400' : error ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}\`} />
            </div>
            {health ? (
              <div className="space-y-2">
                <p className="text-green-400 font-mono text-sm">● {health.status.toUpperCase()}</p>
                <p className="text-muted text-xs font-mono">{health.timestamp}</p>
              </div>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <div className="flex items-center gap-2 text-muted">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Connecting...
              </div>
            )}
          </div>

          {/* Items Card */}
          <div className="p-6 rounded-xl bg-card border border-slate-700/50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold text-white mb-4">Sample Data</h2>
            {items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className={\`w-2 h-2 rounded-full \${item.done ? 'bg-green-400' : 'bg-yellow-400'}\`} />
                    {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No items loaded yet</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <div className="inline-flex gap-4">
            <a href="#" className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium hover:opacity-90 transition-all">
              Open Dashboard
            </a>
            <a href="#" className="px-8 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:border-primary/50 hover:text-white transition-all">
              API Docs →
            </a>
          </div>
        </div>

        <div className="mt-24 text-center text-sm text-muted">
          <p>Frontend on :3000 &middot; API on :3001 &middot; Edit <code className="text-primary">apps/web/src/App.tsx</code></p>
        </div>
      </div>
    </div>
  )
}`,
    })

    files.push({
      path: "apps/web/src/vite-env.d.ts",
      content: `/// <reference types="vite/client" />`,
    })

    files.push({
      path: "apps/web/public/favicon.svg",
      content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#3b82f6"/><text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold">A</text></svg>`,
    })

    // ── apps/api (Bun + Hono) ──
    files.push({
      path: "apps/api/package.json",
      content: json({
        name: "@myapp/api",
        private: true,
        type: "module",
        scripts: {
          dev: "bun run --hot src/index.ts",
          build: "bun build src/index.ts --outdir ./dist",
          start: "bun run dist/index.js",
          test: "bun test",
        },
        dependencies: {
          hono: "^4.0.0",
          zod: "^4.0.0",
          "@hono/zod-validator": "^1.0.0",
        },
        devDependencies: {
          typescript: "^5.7.0",
          "@types/bun": "^1.2.0",
        },
      }),
    })

    files.push({
      path: "apps/api/tsconfig.json",
      content: json({
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          outDir: "./dist",
        },
        include: ["src"],
      }),
    })

    files.push({
      path: "apps/api/.env.example",
      content: `PORT=3001
NODE_ENV=development`,
    })

    files.push({
      path: "apps/api/src/index.ts",
      content: `import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', cors({ origin: ['http://localhost:3000'], credentials: true }))
app.use('*', logger())

app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/v1/items', async (c) => {
  const items = [
    { id: 1, name: 'Build full-stack apps', done: false },
    { id: 2, name: 'Ship to production', done: false },
  ]
  return c.json(items)
})

app.post('/api/v1/items', async (c) => {
  const body = await c.req.json()
  return c.json({ id: Date.now(), ...body, done: false }, 201)
})

Bun.serve({
  port: parseInt(process.env.PORT || '3001'),
  fetch: app.fetch,
})

console.log(\`API running on http://localhost:\${process.env.PORT || 3001}\`)`,
    })

    files.push({
      path: "apps/api/src/config.ts",
      content: `export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
}`,
    })

    // ── packages/shared ──
    files.push({
      path: "packages/shared/package.json",
      content: json({
        name: "@myapp/shared",
        private: true,
        type: "module",
        main: "./src/index.ts",
        types: "./src/index.ts",
        devDependencies: { typescript: "^5.7.0" },
      }),
    })

    files.push({
      path: "packages/shared/tsconfig.json",
      content: json({
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          strict: true,
        },
        include: ["src"],
      }),
    })

    files.push({
      path: "packages/shared/src/types.ts",
      content: `export interface Item {
  id: number
  name: string
  done: boolean
  createdAt?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export type HealthStatus = 'ok' | 'degraded' | 'down'`,
    })

    files.push({
      path: "packages/shared/src/index.ts",
      content: `export * from './types'`,
    })

    // ── Docker Compose ──
    files.push({
      path: "docker-compose.yml",
      content: `services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: myapp
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
    })

    return files
  },
}
