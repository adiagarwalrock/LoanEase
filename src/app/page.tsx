'use client'

import { useState } from 'react'
import type { AmortizationResult } from '@/lib/types'
import { LoanForm } from '@/components/loan-form'
import { AmortizationDisplay } from '@/components/amortization-display'
import { Logo } from '@/components/logo'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
  const [result, setResult] = useState<AmortizationResult | null>(null)
  const { toast } = useToast()

  const handleCalculation = (data: AmortizationResult | null, error?: string) => {
    if (error) {
      setResult(null)
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: error,
      })
    } else {
      setResult(data)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <Logo />
        <h1 className="text-2xl font-bold text-foreground tracking-tight">LoanEase</h1>
      </header>
      <main className="flex-1 bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 p-4 md:grid-cols-2 md:p-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <LoanForm onCalculate={handleCalculation} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <AmortizationDisplay result={result} />
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ by an expert AI engineer.</p>
      </footer>
    </div>
  )
}
