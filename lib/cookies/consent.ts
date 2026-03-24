/** localStorage key for GDPR-style consent */
export const CONSENT_STORAGE_KEY = 'svg_optimizer_cookie_consent'

export type CookieConsentValue = 'essential' | 'all' | 'rejected'

export function parseConsent(raw: string | null): CookieConsentValue | null {
  if (raw === 'essential' || raw === 'all' || raw === 'rejected') return raw
  return null
}

/** Non-essential = analytics / marketing style cookies & scripts */
export function allowsAnalytics(consent: CookieConsentValue | null): boolean {
  return consent === 'all'
}
