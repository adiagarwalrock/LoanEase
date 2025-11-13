'use client'

import { useState } from 'react'
import { Calculator, Landmark, PiggyBank, Receipt } from 'lucide-react'
import type { AmortizationResult, AmortizationEntry } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from './ui/separator'

interface AmortizationDisplayProps {
  result: AmortizationResult | null
  currency: string;
}

const SummaryCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <Card className="flex-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

interface YearlyEntry {
    year: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export function AmortizationDisplay({ result, currency }: AmortizationDisplayProps) {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly')

  const yearlySchedule: YearlyEntry[] = result ? result.schedule.reduce((acc: YearlyEntry[], entry: AmortizationEntry) => {
    const year = Math.ceil(entry.month / 12);
    let yearEntry = acc.find(e => e.year === year);
    if (!yearEntry) {
        yearEntry = { year, payment: 0, principal: 0, interest: 0, balance: 0 };
        acc.push(yearEntry);
    }
    yearEntry.payment += entry.payment;
    yearEntry.principal += entry.principal;
    yearEntry.interest += entry.interest;
    yearEntry.balance = entry.balance;
    return acc;
  }, []) : [];

  if (!result) {
    return (
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
          <CardDescription>Your payment schedule will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-7.5rem)] items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Calculator className="mx-auto h-12 w-12" />
            <p className="mt-4">Adjust the form to see your schedule.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Amortization Results</CardTitle>
                <CardDescription>A detailed breakdown of your loan payments over time.</CardDescription>
            </div>
            <Tabs defaultValue="monthly" onValueChange={(value) => setView(value as 'monthly' | 'yearly')} className="print:hidden">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-wrap gap-4">
            <SummaryCard 
                icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
                title="Monthly Payment"
                value={formatCurrency(result.monthlyPayment, currency)}
            />
            <SummaryCard 
                icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
                title="Total Interest"
                value={formatCurrency(result.totalInterest, currency)}
            />
            <SummaryCard 
                icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
                title="Total Cost"
                value={formatCurrency(result.totalPayment, currency)}
            />
        </div>
        
        <Separator />

        <ScrollArea className="h-96 w-full rounded-md border">
          {view === 'monthly' ? (
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead className="w-[80px]">Month</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.schedule.map((entry) => (
                  <TableRow key={entry.month}>
                    <TableCell className="font-medium">{entry.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.payment, currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.principal, currency)}</TableCell>
                    <TableCell className="text-right text-destructive/80">{formatCurrency(entry.interest, currency)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(entry.balance, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead className="w-[80px]">Year</TableHead>
                  <TableHead className="text-right">Total Payment</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Ending Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlySchedule.map((entry) => (
                  <TableRow key={entry.year}>
                    <TableCell className="font-medium">{entry.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.payment, currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.principal, currency)}</TableCell>
                    <TableCell className="text-right text-destructive/80">{formatCurrency(entry.interest, currency)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(entry.balance, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
