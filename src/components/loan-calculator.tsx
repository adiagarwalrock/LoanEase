'use client'

import { useState, useCallback, useRef } from 'react'
import type { AmortizationResult } from '@/lib/types'
import { LoanForm } from '@/components/loan-form'
import { AmortizationDisplay } from '@/components/amortization-display'
import { useToast } from '@/hooks/use-toast'
import { generateAmortizationSchedule } from '@/lib/calculator'

export function LoanCalculator() {
  const [result, setResult] = useState<AmortizationResult | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [comments, setComments] = useState('')
  const { toast } = useToast()

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCalculation = useCallback(async (values: any) => {
    const { data, error } = await generateAmortizationSchedule(values);
    if (error) {
      setResult(null)
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: error,
      })
    } else {
      setResult(data ?? null)
    }
  }, [toast])

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 p-4 md:grid-cols-2 md:p-8 lg:grid-cols-3 print-hidden">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <LoanForm
            onCalculate={handleCalculation}
            onCurrencyChange={setCurrency}
            currency={currency}
            comments={comments}
            onCommentsChange={setComments}
            onPrint={handlePrint}
          />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <AmortizationDisplay result={result} currency={currency} comments={comments} />
        </div>
      </div>
      <div className="print-only" style={{ display: 'none' }}>
        <div ref={printRef} className="print-container">
          <AmortizationDisplay result={result} currency={currency} comments={comments} isPrintView />
        </div>
      </div>
    </>
  )
}
