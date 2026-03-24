import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail, Github, MessageCircle, ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig, twitterProfileUrl } from '@/config/site'
import { cn } from '@/lib/utils'
import { MailtoForm } from '@/components/contact/MailtoForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name} — feedback, support, and partnerships.`,
}

export default function ContactPage() {
  const email = siteConfig.contactEmail
  const github = siteConfig.contactGithubUrl
  const twitter = twitterProfileUrl()

  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-primary/[0.07] to-transparent">
      <Container className="max-w-3xl py-12 md:py-16">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-8 -ml-2 inline-flex gap-1')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tool
        </Link>

        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Contact</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Get in touch</h1>
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
          Questions about the optimizer, bug reports, feature ideas, or partnerships—we read every message
          when contact channels are configured for this deployment.
        </p>

        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {email ? (
            <Card className="border-border/80 bg-card/80 shadow-sm sm:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5" aria-hidden />
                  <CardTitle className="text-lg">Email</CardTitle>
                </div>
                <CardDescription>
                  Prefer email? Reach us directly or compose a message below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {email}
                  </a>
                </p>
                <MailtoForm to={email} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/80 bg-card/80 shadow-sm sm:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" aria-hidden />
                  <CardTitle className="text-lg">Email</CardTitle>
                </div>
                <CardDescription>
                  No public email is configured for this site yet. Use the blog or any social / GitHub links
                  below when they’re available.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {twitter && (
            <Card className="border-border/80 bg-card/80 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  <CardTitle className="text-lg">X (Twitter)</CardTitle>
                </div>
                <CardDescription>Quick questions or shout-outs.</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex w-full sm:w-auto')}
                >
                  {siteConfig.twitterHandle}
                </a>
              </CardContent>
            </Card>
          )}

          {github && (
            <Card className="border-border/80 bg-card/80 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Github className="h-5 w-5" aria-hidden />
                  <CardTitle className="text-lg">GitHub</CardTitle>
                </div>
                <CardDescription>Issues, source, and contributions.</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex w-full sm:w-auto')}
                >
                  Open repository
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        <section className="rounded-xl border border-border/80 bg-muted/20 p-6 md:p-8">
          <h2 className="mb-4 text-lg font-semibold">What we can help with</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>SVG optimization settings, batch export, or something not working in your browser.</li>
            <li>Suggestions for the tool, blog topics, or accessibility improvements.</li>
            <li>Privacy questions—see also our{' '}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            For self-hosted setups, responses depend on how you deploy. The{' '}
            <Link href="/blog" className="text-primary underline-offset-4 hover:underline">
              blog
            </Link>{' '}
            has guides and updates you can browse anytime.
          </p>
        </section>
      </Container>
    </div>
  )
}
