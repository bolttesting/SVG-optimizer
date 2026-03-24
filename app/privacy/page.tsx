import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How SVG Optimizer handles your data, cookies, and analytics.',
}

export default function PrivacyPage() {
  const siteUrl = siteConfig.url
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? ''
  const contactEmail = siteConfig.contactEmail

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mb-10 text-muted-foreground">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-muted-foreground">
            SVG Optimizer is built to respect your privacy. The interactive tool runs in your
            browser; optimization may also use our API when you click optimize, depending on your
            deployment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">SVG files</h2>
          <p className="text-muted-foreground">
            When you use the in-browser flow, files stay on your device until you choose to download
            them. If your build uses the <code className="text-sm">/api/optimize</code> route, the
            SVG is sent to your own server only for that request and is not used for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies & local storage</h2>
          <p className="text-muted-foreground">
            For{' '}
            <a
              href={siteUrl}
              className="text-primary underline-offset-4 hover:underline"
              rel="noopener noreferrer"
            >
              {siteUrl}
            </a>
            , we may store a <strong>cookie consent choice</strong> in{' '}
            <code className="text-sm">localStorage</code> and a small <strong>cookie</strong> (same
            name) so we remember whether you accepted only essential cookies or analytics as well.
            Theme preference (light/dark) may also be stored locally in your browser.
          </p>
          <ul className="list-disc text-muted-foreground">
            <li>
              <strong>Essential</strong> — required to remember your consent and basic preferences.
            </li>
            <li>
              <strong>Analytics</strong> —{' '}
              {plausibleDomain ? (
                <>
                  loaded only if you choose &quot;Accept all&quot;. We use{' '}
                  <a
                    href="https://plausible.io/privacy-focused-web-analytics"
                    className="text-primary underline-offset-4 hover:underline"
                    rel="noopener noreferrer"
                  >
                    Plausible
                  </a>
                  , a privacy-oriented analytics service. Page views are associated with the site
                  domain <code className="text-sm">{plausibleDomain}</code>; the script is loaded
                  from plausible.io.
                </>
              ) : (
                <>
                  optional third-party analytics (Plausible) loads only if you choose
                  &quot;Accept all&quot; and we have turned it on for this site. This deployment does
                  not include a Plausible site domain, so no analytics script is loaded.
                </>
              )}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changing your mind</h2>
          <p className="text-muted-foreground">
            Clear site data for <code className="text-sm">{new URL(siteUrl).hostname}</code> in your
            browser settings, or open the site in a private window, to see the cookie banner again
            and choose a new option.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions?{' '}
            {contactEmail ? (
              <>
                Email{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                {' '}
                or use the{' '}
              </>
            ) : (
              <>Use the </>
            )}
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  )
}
