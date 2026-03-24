/**
 * Production start helper: honors PORT and HOST from the environment.
 * Many hosts (e.g. Hostinger Node, Railway) set PORT; hardcoding 3000 breaks the reverse proxy → 503.
 */
const { spawn } = require('child_process')
const path = require('path')

const port = String(process.env.PORT || '3000')
const host = process.env.HOST || '0.0.0.0'
const nextCli = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')

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
