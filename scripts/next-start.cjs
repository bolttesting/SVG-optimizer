/**
 * Production start:
 * 1) Prefer Next standalone `server.js` (Hostinger-friendly traced bundle).
 * 2) Else `next start` (dev / legacy deploys).
 *
 * PORT: set by the host (default 3000).
 * LISTEN_HOST / NEXT_LISTEN_HOST: bind address. Standalone reads HOSTNAME — we set it from these
 * so the OS HOSTNAME (e.g. srv.hostinger.com) does not break LiteSpeed → Node.
 * Never use panel "HOST" domain string for binding.
 */
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const port = String(process.env.PORT || '3000')
const bindHost =
  process.env.LISTEN_HOST || process.env.NEXT_LISTEN_HOST || '0.0.0.0'

const root = path.join(__dirname, '..')
const standaloneDir = path.join(root, '.next', 'standalone')
const standaloneServer = path.join(standaloneDir, 'server.js')
const nextCli = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')

console.error(`[svg-optimizer] cwd=${process.cwd()}`)
console.error(`[svg-optimizer] project=${root}`)
console.error(`[svg-optimizer] standalone server.js exists=${fs.existsSync(standaloneServer)}`)

if (fs.existsSync(standaloneServer)) {
  console.error(
    `[svg-optimizer] standalone bind ${bindHost}:${port} (try LISTEN_HOST=127.0.0.1 if LiteSpeed returns 503)`
  )
  const child = spawn(process.execPath, ['server.js'], {
    cwd: standaloneDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port,
      // Next standalone reads HOSTNAME; Linux often sets it to the machine name — override for TCP bind.
      HOSTNAME: bindHost,
    },
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
} else {
  console.error(
    `[svg-optimizer] next start ${bindHost}:${port} (no .next/standalone — run full production build)`
  )
  const child = spawn(process.execPath, [nextCli, 'start', '-H', bindHost, '-p', port], {
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
}
