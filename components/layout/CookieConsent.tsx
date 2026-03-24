'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CONSENT_STORAGE_KEY, type CookieConsentValue, parseConsent } from '@/lib/cookies/consent'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
      setVisible(stored === null)
    } catch {
      setVisible(true)
    }
  }, [])

  function save(value: CookieConsentValue) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value)
      document.cookie = `${CONSENT_STORAGE_KEY}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`
    } catch {
      // ignore
    }
    setVisible(false)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie-consent-changed'))
    }
  }

  if (!mounted || !visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t bg-card/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur-md sm:p-5"
      role="dialog"
      aria-label="Cookie preferences"
    >
      <div className="container mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">Cookies & privacy</p>
          <p>
            This applies to{' '}
            <strong className="text-foreground">
              {(() => {
                try {
                  return new URL(siteConfig.url).hostname
                } catch {
                  return 'this site'
                }
              })()}
            </strong>
            . We use <strong>essential</strong> cookies to remember this choice and keep the site
            working. Optional <strong>analytics</strong> help us understand traffic—only if you accept.
            Read more in our{' '}
            <Link href="/privacy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex w-full flex-shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 w-full sm:min-h-9 sm:w-auto"
            onClick={() => save('rejected')}
          >
            Reject non-essential
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-h-11 w-full sm:min-h-9 sm:w-auto"
            onClick={() => save('essential')}
          >
            Essential only
          </Button>
          <Button type="button" size="sm" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={() => save('all')}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  )
}
