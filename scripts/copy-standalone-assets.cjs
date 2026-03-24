/**
 * After `next build` with output: 'standalone', copy static assets the traced bundle does not include.
 * @see https://nextjs.org/docs/app/building-your-application/deploying#manual-setup
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const standalone = path.join(root, '.next', 'standalone')
const staticSrc = path.join(root, '.next', 'static')
const staticDst = path.join(standalone, '.next', 'static')
const publicSrc = path.join(root, 'public')
const publicDst = path.join(standalone, 'public')

if (!fs.existsSync(standalone)) {
  console.error('[copy-standalone-assets] Missing .next/standalone — run `next build` first.')
  process.exit(1)
}

if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDst), { recursive: true })
  fs.rmSync(staticDst, { recursive: true, force: true })
  fs.cpSync(staticSrc, staticDst, { recursive: true })
}

if (fs.existsSync(publicSrc)) {
  fs.rmSync(publicDst, { recursive: true, force: true })
  fs.cpSync(publicSrc, publicDst, { recursive: true })
}

console.error('[copy-standalone-assets] public + .next/static → .next/standalone')
