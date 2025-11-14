import { LoanCalculator } from '@/components/loan-calculator'
import { Logo } from '@/components/logo'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 print-hidden">
        <Logo />
        <h1 className="text-2xl font-bold text-foreground tracking-tight">LoanEase</h1>
      </header>
      <main className="flex-1 bg-muted/40">
        <div className="mx-auto w-full max-w-7xl p-4 md:p-8 space-y-6">
            <Card className="print-hidden">
              <CardHeader>
                <CardTitle>Welcome to LoanEase</CardTitle>
                <CardDescription>
                  Your go-to tool for calculating and visualizing loan amortization schedules. Easily understand your payments for a mortgage, auto, or personal loan.
                </CardDescription>
              </CardHeader>
            </Card>
            <LoanCalculator />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground print-hidden">
        <p>Built with ❤️ by an expert AI engineer.</p>
      </footer>
    </div>
  )
}
