/**
 * Production start helper: honors PORT and an explicit listen host.
 * - PORT: many hosts (Hostinger, Railway) set this; must not hardcode 3000 only.
 * - Do NOT use process.env.HOST for binding: panels often set HOST to the site domain
 *   (e.g. svgoptimizer.site), which is not a bind address → Next listens on the wrong
 *   interface → LiteSpeed/nginx gets connection refused → 503.
 */
const { spawn } = require('child_process')
const path = require('path')

const port = String(process.env.PORT || '3000')
const host = process.env.LISTEN_HOST || process.env.NEXT_LISTEN_HOST || '0.0.0.0'
const nextCli = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')

console.error(
  `[svg-optimizer] Starting Next.js on ${host}:${port} (PORT=${process.env.PORT ?? 'default 3000'}; set LISTEN_HOST=127.0.0.1 only if your host docs say to bind localhost)`
)

const child = spawn(process.execPath, [nextCli, 'start', '-H', host, '-p', port], {
  stdio: 'inherit',
  env: process.env,
  windowsHide: true,
})

child.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code == null ? 1 : code)
})
