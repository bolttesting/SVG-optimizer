const path = require('path')
const { loadEnvConfig } = require('@next/env')

// Load .env / .env.local before Middleware is bundled so ADMIN_SECRET is available in Edge
loadEnvConfig(path.join(__dirname))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Traced server bundle — reliable on many Node hosts (Hostinger, Docker).
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig
