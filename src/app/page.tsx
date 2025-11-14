import { LoanCalculator } from '@/components/loan-calculator'
import { Logo } from '@/components/logo'

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <Logo />
        <h1 className="text-2xl font-bold text-foreground tracking-tight">LoanEase</h1>
      </header>
      <main className="flex-1 bg-muted/40">
        <LoanCalculator />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ by an expert AI engineer.</p>
      </footer>
    </div>
  )
}
