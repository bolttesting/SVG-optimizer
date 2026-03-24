import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using SVG Optimizer at svgoptimizer.site.',
}

export default function TermsPage() {
  const siteUrl = siteConfig.url
  const siteHost = (() => {
    try {
      return new URL(siteUrl).hostname
    } catch {
      return 'svgoptimizer.site'
    }
  })()
  const contactEmail = siteConfig.contactEmail

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mb-10 text-muted-foreground">Last updated: March 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-semibold">The service</h2>
          <p className="text-muted-foreground">
            <strong>SVG Optimizer</strong> is the web application offered at{' '}
            <a
              href={siteUrl}
              className="text-primary underline-offset-4 hover:underline"
              rel="noopener noreferrer"
            >
              {siteUrl}
            </a>{' '}
            (<code className="text-sm">{siteHost}</code>), including the in-browser optimization tool,
            optional server-side optimization where enabled, and related pages such as the blog and
            contact form.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Acceptable use</h2>
          <p className="text-muted-foreground">
            Use the service lawfully and responsibly. Do not attempt to disrupt the site, overload
            systems, probe for vulnerabilities without permission, or use the tool to process
            content you are not allowed to handle. We may suspend or restrict access for abuse or
            risk to the service or others.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Disclaimer</h2>
          <p className="text-muted-foreground">
            The service is provided <strong>as is</strong>, without warranties of any kind. We do
            not guarantee uninterrupted availability or that outputs will meet every use case. You
            are responsible for verifying results before relying on them in production.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Privacy</h2>
          <p className="text-muted-foreground">
            How we handle data, cookies, and analytics is described in our{' '}
            <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes</h2>
          <p className="text-muted-foreground">
            We may update these terms or the service. Continued use after changes constitutes
            acceptance of the updated terms. The &quot;Last updated&quot; date above reflects the
            latest revision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions about these terms?{' '}
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
                or visit the{' '}
              </>
            ) : (
              <>Visit the </>
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
