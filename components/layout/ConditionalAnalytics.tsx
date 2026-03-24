'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  CONSENT_STORAGE_KEY,
  allowsAnalytics,
  parseConsent,
  type CookieConsentValue,
} from '@/lib/cookies/consent'

function getInitialConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

export function ConditionalAnalytics() {
  const [enabled, setEnabled] = useState(false)
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  useEffect(() => {
    const sync = () => setEnabled(allowsAnalytics(getInitialConsent()))
    sync()
    window.addEventListener('cookie-consent-changed', sync)
    return () => window.removeEventListener('cookie-consent-changed', sync)
  }, [])

  if (!domain || !enabled) return null

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
