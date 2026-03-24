import { SvgOptimizerWorkspace } from '@/components/tool/SvgOptimizerWorkspace'

/** Server-rendered hero so the page is not blank if client JS fails to load or hydrate. */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60 py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Privacy-first · No third-party uploads
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Free SVG Optimizer
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Shrink SVGs by up to 70% with live preview. Tune precision, presets, and batch export—
            <span className="text-foreground/90"> your files stay under your control.</span>
          </p>
        </div>
      </section>
      <SvgOptimizerWorkspace />
    </div>
  )
}
