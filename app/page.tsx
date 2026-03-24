import { UsageCountUp } from '@/components/home/UsageCountUp'
import { SvgOptimizerWorkspace } from '@/components/tool/SvgOptimizerWorkspace'

/** Server-rendered hero so the page is not blank if client JS fails to load or hydrate. */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60 py-10 sm:py-14 md:py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex max-w-[min(100%,20rem)] flex-wrap items-center justify-center gap-x-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-center text-xs font-medium text-primary">
            Privacy-first · No third-party uploads
          </div>
          <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Free SVG Optimizer
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Shrink SVGs by up to 70% with live preview. Tune precision, presets, and batch export—
            <span className="text-foreground/90"> your files stay under your control.</span>
          </p>
          <UsageCountUp />
        </div>
      </section>
      <SvgOptimizerWorkspace />
    </div>
  )
}
