'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Banknote, CalendarDays, Percent, Printer } from 'lucide-react'

import { LoanSchema, type LoanFormValues, type AmortizationResult } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from './ui/separator'

interface LoanFormProps {
  onCalculate: (data: AmortizationResult | null, error?: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  generateAmortizationSchedule: (values: LoanFormValues) => { data?: AmortizationResult; error?: string };
}

export function LoanForm({ onCalculate, currency, onCurrencyChange, generateAmortizationSchedule }: LoanFormProps) {
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(LoanSchema),
    defaultValues: {
      principal: 100000,
      interestRate: 5,
      loanTerm: 30,
      interestType: 'compound',
    },
    mode: 'onChange'
  })

  useEffect(() => {
    const subscription = form.watch((watchedValues) => {
      const { success } = LoanSchema.safeParse(watchedValues);
      if (success) {
        const result = generateAmortizationSchedule(watchedValues as LoanFormValues);
        onCalculate(result.data ?? null, result.error);
      } else {
        const validation = LoanSchema.safeParse(watchedValues);
        if (!validation.success) {
            const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
            if(firstError) {
              onCalculate(null, firstError);
            } else {
              onCalculate(null, "Please check your inputs.");
            }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onCalculate, generateAmortizationSchedule]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
        <CardDescription>Enter your loan information to see the schedule.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Principal ({currency})</FormLabel>
                  <div className="relative">
                    <Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="1000" placeholder="e.g., 250000" className="pl-8" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Interest Rate (%)</FormLabel>
                  <div className="relative">
                    <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 6.5" className="pl-8" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Term (Years): {field.value}</FormLabel>
                   <div className="relative flex items-center">
                    <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Slider
                        min={1}
                        max={40}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-2 pl-8"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Interest Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="compound" />
                        </FormControl>
                        <FormLabel className="font-normal">Compound</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="simple" />
                        </FormControl>
                        <FormLabel className="font-normal">Simple</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Separator />
            <div className="space-y-2">
                <FormLabel>Currency</FormLabel>
                <Select value={currency} onValueChange={onCurrencyChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePrint} className="w-full" variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
