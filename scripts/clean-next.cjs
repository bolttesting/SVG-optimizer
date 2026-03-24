/**
 * Remove .next so dev/build never loads stale webpack chunks (e.g. Cannot find module './948.js').
 * Usage: node scripts/clean-next.cjs   or   npm run dev:clean
 */
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', '.next')
try {
  fs.rmSync(dir, { recursive: true, force: true })
  console.log('[clean-next] removed', dir)
} catch (e) {
  if (e && e.code !== 'ENOENT') throw e
}
