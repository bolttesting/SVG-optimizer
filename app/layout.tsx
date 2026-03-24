import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { ConditionalAnalytics } from '@/components/layout/ConditionalAnalytics'
import { UsageAnalyticsBeacon } from '@/components/layout/UsageAnalyticsBeacon'
import { siteConfig } from '@/config/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const metadataBase = new URL(`${siteConfig.url.replace(/\/$/, '')}/`)

/** Ensures real device width for media queries (nav breakpoints) and prevents “desktop layout in a pannable viewport”. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase,
  // Tab + PWA icons: app/favicon.ico, app/icon.png, app/apple-icon.png (Next.js file conventions).
  // Vector brand mark remains at public/icon.svg for direct use.
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full overflow-x-clip" suppressHydrationWarning>
      <body
        className={`${inter.className} relative z-0 flex min-h-screen min-w-0 flex-col overflow-x-clip font-sans antialiased`}
        suppressHydrationWarning
      >
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-primary/[0.08] blur-3xl dark:bg-primary/[0.12]" />
          <div className="absolute -right-1/4 top-1/3 h-[360px] w-[60%] rounded-full bg-violet-500/[0.06] blur-3xl dark:bg-violet-400/[0.08]" />
        </div>
        <Header />
        <main className="relative min-w-0 w-full max-w-full flex-1 overflow-x-clip">{children}</main>
        <Footer />
        <CookieConsent />
        <ConditionalAnalytics />
        <UsageAnalyticsBeacon />
      </body>
    </html>
  )
}
