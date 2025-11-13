'use client'

import { Calculator, Landmark, PiggyBank, Receipt } from 'lucide-react'
import type { AmortizationResult } from '@/lib/types'
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

export function AmortizationDisplay({ result, currency }: AmortizationDisplayProps) {
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
        <CardTitle>Amortization Results</CardTitle>
        <CardDescription>A detailed breakdown of your loan payments over time.</CardDescription>
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
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
