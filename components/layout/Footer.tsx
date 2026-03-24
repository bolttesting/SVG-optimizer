import Link from 'next/link'
import { siteConfig } from '@/config/site'

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="mt-auto min-w-0 max-w-full overflow-x-clip border-t border-border/60 bg-muted/20">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Site
          </p>
          <ul className="space-y-2 text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {siteConfig.contactEmail && (
            <p className="mt-4 text-sm">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          )}
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Indexing
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/sitemap.xml" className="text-primary underline-offset-4 hover:underline">
              sitemap.xml
            </Link>{' '}
            and{' '}
            <Link href="/robots.txt" className="text-primary underline-offset-4 hover:underline">
              robots.txt
            </Link>{' '}
            help search engines discover pages and blog posts.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6">
        <p className="container text-balance text-center text-xs leading-relaxed text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Designed & developed by{' '}
          <a
            href="https://logixcontact.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Logix Contact
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
