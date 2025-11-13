'use client'

import { useState, useEffect } from 'react'
import { Calculator, Landmark, PiggyBank, Receipt, MessageSquare, CalendarClock, TrendingDown, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import type { AmortizationResult, AmortizationEntry } from '@/lib/types'
import { formatCurrency, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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
  result: AmortizationResult | null;
  currency: string;
  comments: string;
  isPrintView?: boolean;
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

export function AmortizationDisplay({ result, currency, comments, isPrintView = false }: AmortizationDisplayProps) {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly')
  const [reportDate, setReportDate] = useState<string>('');

  useEffect(() => {
    // This will run only on the client, preventing hydration mismatch
    setReportDate(new Date().toLocaleString());
  }, [result]);


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
  
  const principalPaid = result?.schedule.filter(e => e.paid).reduce((acc, e) => acc + e.principal, 0) ?? 0;
  const interestPaid = result?.schedule.filter(e => e.paid).reduce((acc, e) => acc + e.interest, 0) ?? 0;
  const principalRemaining = (result?.schedule[0]?.balance ?? 0) + (result?.schedule[0]?.principal ?? 0) - principalPaid;
  const interestRemaining = (result?.totalInterest ?? 0) - interestPaid;

  if (!result && !isPrintView) {
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
  
  if (!result) {
    return null;
  }

  const ScheduleTable = isPrintView || view === 'monthly' ? (
    <Table>
      <TableHeader className={cn(!isPrintView && "sticky top-0 bg-muted")}>
        <TableRow>
          <TableHead className="w-[80px]">Month</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Payment</TableHead>
          <TableHead className="text-right">Principal</TableHead>
          <TableHead className="text-right">Interest</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.schedule.map((entry) => (
          <TableRow key={entry.month} className={cn(entry.paid && 'bg-secondary/40')}>
            <TableCell className="font-medium">{entry.month}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span>{format(entry.paymentDate, "MMM yyyy")}</span>
                    {entry.paid && <Badge variant="secondary">Paid</Badge>}
                </div>
            </TableCell>
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
  );

  return (
    <div id={isPrintView ? '' : 'amortization-results'}>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Amortization Results</CardTitle>
                <CardDescription>A detailed breakdown of your loan payments over time.</CardDescription>
            </div>
            <Tabs defaultValue="monthly" onValueChange={(value) => setView(value as 'monthly' | 'yearly')} className={cn(isPrintView && "hidden")}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <SummaryCard 
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                title="Principal Paid"
                value={formatCurrency(principalPaid, currency)}
            />
             <SummaryCard 
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                title="Interest Paid"
                value={formatCurrency(interestPaid, currency)}
            />
             <SummaryCard 
                icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
                title="Principal Remaining"
                value={formatCurrency(principalRemaining, currency)}
            />
            <SummaryCard 
                icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
                title="Interest Remaining"
                value={formatCurrency(interestRemaining, currency)}
            />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarClock className="w-4 h-4" />
              Report Generated
            </h3>
            <p className="text-sm text-muted-foreground">{reportDate}</p>
          </div>

        {comments && (
          <div id="comments-section" className="space-y-2">
            <Separator />
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Personal Comments
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comments}</p>
          </div>
        )}
        
        <Separator />

        {isPrintView ? ScheduleTable : (
          <ScrollArea className="h-96 w-full rounded-md border">
            {ScheduleTable}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
