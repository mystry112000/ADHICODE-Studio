import { UI } from "../ui"

export const WEB_DASHBOARD = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ADHICODE Studio Dashboard</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0a0f; color: #e0e0e0; min-height: 100vh; }
  .header { background: linear-gradient(135deg, #00c853, #00bcd4); padding: 20px 40px; display: flex; align-items: center; gap: 16px; }
  .header h1 { font-size: 24px; color: #fff; }
  .header span { font-size: 14px; opacity: 0.8; color: #fff; }
  .content { padding: 30px 40px; max-width: 1200px; margin: 0 auto; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px; }
  .stat-card { background: #14141f; border: 1px solid #2a2a3a; border-radius: 12px; padding: 20px; }
  .stat-card .num { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #00c853, #00bcd4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-card .label { font-size: 13px; color: #888; margin-top: 4px; }
  .section { background: #14141f; border: 1px solid #2a2a3a; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  .section h2 { font-size: 18px; margin-bottom: 16px; color: #fff; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .card { background: #1a1a28; border: 1px solid #2a2a3a; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; }
  .card:hover { border-color: #00c853; transform: translateY(-2px); }
  .card h3 { font-size: 14px; color: #fff; margin-bottom: 4px; }
  .card p { font-size: 12px; color: #888; }
  .card .tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 4px; margin-top: 8px; }
  .tag-code { background: #1a3a1a; color: #4caf50; }
  .tag-system { background: #1a2a3a; color: #4fc3f7; }
  .tag-web { background: #2a1a3a; color: #ce93d8; }
  .tag-devops { background: #3a2a1a; color: #ffb74d; }
  .tag-fullstack { background: #1a3a3a; color: #4dd0e1; }
  .terminal-box { background: #000; border-radius: 8px; padding: 16px; font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 13px; }
  .terminal-box .line { color: #4caf50; }
  .terminal-box .line span { color: #888; }
  .cmd { display: inline-block; background: #2a2a3a; color: #fff; padding: 2px 10px; border-radius: 4px; font-family: monospace; font-size: 12px; margin: 2px; }
  .footer { text-align: center; padding: 20px; color: #555; font-size: 12px; }
  @media (max-width: 600px) { .content { padding: 16px; } .header { padding: 16px; } }
</style>
</head>
<body>
<div class="header">
  <h1>ADHICODE Studio</h1>
  <span>v2.0 &middot; AI-Powered Development Platform</span>
</div>
<div class="content">
  <div class="stats">
    <div class="stat-card"><div class="num">26</div><div class="label">Built-in Tools</div></div>
    <div class="stat-card"><div class="num">9</div><div class="label">Skills</div></div>
    <div class="stat-card"><div class="num">7</div><div class="label">Workflows</div></div>
    <div class="stat-card"><div class="num">4</div><div class="label">Platforms</div></div>
  </div>

  <div class="section">
    <h2>Quick Commands</h2>
    <div class="terminal-box">
      <div class="line">$ <span>adhicode-studio</span> tools        <span style="color:#888;"># List all 26 tools</span></div>
      <div class="line">$ <span>adhicode-studio</span> run websearch <span style="color:#888;"># Search the web</span></div>
      <div class="line">$ <span>adhicode-studio</span> terminal     <span style="color:#888;"># Launch terminal</span></div>
      <div class="line">$ <span>adhicode-studio</span> workflow build<span style="color:#888;"> # Run build workflow</span></div>
      <div class="line">$ <span>adhicode-studio</span> jarvis       <span style="color:#888;"># Launch Jarvis AI</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Tools</h2>
    <div class="grid">
      <div class="card" onclick="runCmd('run format')"><h3>format</h3><p>Format code with prettier</p><span class="tag tag-code">code</span></div>
      <div class="card" onclick="runCmd('run lint')"><h3>lint</h3><p>Lint code with eslint/tsc</p><span class="tag tag-code">code</span></div>
      <div class="card" onclick="runCmd('run review')"><h3>review</h3><p>AI-powered code review</p><span class="tag tag-code">code</span></div>
      <div class="card" onclick="runCmd('run sysinfo')"><h3>sysinfo</h3><p>System information</p><span class="tag tag-system">system</span></div>
      <div class="card" onclick="runCmd('run weather')"><h3>weather</h3><p>Weather lookup</p><span class="tag tag-system">system</span></div>
      <div class="card" onclick="runCmd('run websearch')"><h3>websearch</h3><p>DuckDuckGo web search</p><span class="tag tag-fullstack">fullstack</span></div>
      <div class="card" onclick="runCmd('run react')"><h3>react</h3><p>React component boilerplate</p><span class="tag tag-fullstack">fullstack</span></div>
      <div class="card" onclick="runCmd('run api')"><h3>api</h3><p>REST API endpoint boilerplate</p><span class="tag tag-fullstack">fullstack</span></div>
      <div class="card" onclick="runCmd('run shorten')"><h3>shorten</h3><p>Shorten a URL</p><span class="tag tag-web">web</span></div>
      <div class="card" onclick="runCmd('run headers')"><h3>headers</h3><p>Check HTTP headers</p><span class="tag tag-web">web</span></div>
      <div class="card" onclick="runCmd('run gitlog')"><h3>gitlog</h3><p>Git log viewer</p><span class="tag tag-devops">devops</span></div>
      <div class="card" onclick="runCmd('run docker')"><h3>docker</h3><p>Docker commands</p><span class="tag tag-devops">devops</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Workflows</h2>
    <div class="grid">
      <div class="card" onclick="runWf('analyze')"><h3>analyze</h3><p>Analyze codebase structure</p></div>
      <div class="card" onclick="runWf('build')"><h3>build</h3><p>Build and compile project</p></div>
      <div class="card" onclick="runWf('deploy')"><h3>deploy</h3><p>Deploy to production</p></div>
      <div class="card" onclick="runWf('test')"><h3>test</h3><p>Run test suite</p></div>
      <div class="card" onclick="runWf('review')"><h3>review</h3><p>Full code review</p></div>
      <div class="card" onclick="runWf('scaffold')"><h3>scaffold</h3><p>Scaffold new project</p></div>
      <div class="card" onclick="runWf('audit')"><h3>audit</h3><p>Security audit</p></div>
    </div>
  </div>

  <div class="section">
    <h2>Skills</h2>
    <div class="grid">
      <div class="card"><h3>code-review</h3><p>AI code review with best practices</p></div>
      <div class="card"><h3>project-init</h3><p>Initialize projects with templates</p></div>
      <div class="card"><h3>terminal-pro</h3><p>Enhanced terminal with tabs/themes</p></div>
      <div class="card"><h3>termux-optimize</h3><p>Optimize for Android Termux</p></div>
      <div class="card"><h3>voice-control</h3><p>Jarvis voice control integration</p></div>
      <div class="card"><h3>workflow-designer</h3><p>Design custom automation workflows</p></div>
      <div class="card"><h3>fullstack-dev</h3><p>Full-stack dev (React, API, DB, deploy)</p></div>
      <div class="card"><h3>database-pro</h3><p>Database management & migrations</p></div>
      <div class="card"><h3>security-audit</h3><p>Security scanning & vulnerability check</p></div>
    </div>
  </div>
</div>
<div class="footer">ADHICODE Studio v2.0 &middot; Built with Bun &middot; <a href="https://github.com/mystry112000/ADHICODE-Studio" style="color:#00bcd4;">GitHub</a></div>
<script>
function runCmd(cmd) { fetch('/api/run', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cmd}) }).then(r=>r.json()).then(d=>alert(JSON.stringify(d,null,2))).catch(e=>alert('Error: '+e.message)); }
function runWf(name) { fetch('/api/workflow', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name}) }).then(r=>r.json()).then(d=>alert(JSON.stringify(d,null,2))).catch(e=>alert('Error: '+e.message)); }
</script>
</body>
</html>`
