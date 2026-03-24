import { Container } from '@/components/layout/Container'

export default function TermsPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">
        By using SVG Optimizer, you agree to use the service responsibly. The tool is provided as-is
        without warranty.
      </p>
    </Container>
  )
}
