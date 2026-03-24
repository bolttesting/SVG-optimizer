import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { ConditionalAnalytics } from '@/components/layout/ConditionalAnalytics'
import { UsageAnalyticsBeacon } from '@/components/layout/UsageAnalyticsBeacon'
import { siteConfig } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: '/icon.svg',
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-primary/[0.08] blur-3xl dark:bg-primary/[0.12]" />
          <div className="absolute -right-1/4 top-1/3 h-[360px] w-[60%] rounded-full bg-violet-500/[0.06] blur-3xl dark:bg-violet-400/[0.08]" />
        </div>
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <CookieConsent />
        <ConditionalAnalytics />
        <UsageAnalyticsBeacon />
      </body>
    </html>
  )
}
