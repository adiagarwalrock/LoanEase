<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calculator, Landmark, PiggyBank, Receipt, MessageSquare, CalendarClock, TrendingUp } from 'lucide-vue-next'
import { format } from 'date-fns'
import type { AmortizationResult, AmortizationEntry } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Tabs from './ui/Tabs.vue'
import TabsList from './ui/TabsList.vue'
import TabsTrigger from './ui/TabsTrigger.vue'
import Separator from './ui/Separator.vue'
import Badge from './ui/Badge.vue'

const props = defineProps<{
  result: AmortizationResult | null
  currency: string
  comments: string
}>()

const view = ref('monthly')
const reportDate = ref('')

watch(() => props.result, () => {
  reportDate.value = new Date().toLocaleString()
}, { immediate: true })

interface YearlyEntry {
  year: number
  payment: number
  principal: number
  interest: number
  balance: number
}

const yearlySchedule = computed<YearlyEntry[]>(() => {
  if (!props.result) return []
  return props.result.schedule.reduce((acc: YearlyEntry[], entry: AmortizationEntry) => {
    const year = Math.ceil(entry.month / 12)
    let yearEntry = acc.find(e => e.year === year)
    if (!yearEntry) {
      yearEntry = { year, payment: 0, principal: 0, interest: 0, balance: 0 }
      acc.push(yearEntry)
    }
    yearEntry.payment += entry.payment
    yearEntry.principal += entry.principal
    yearEntry.interest += entry.interest
    yearEntry.balance = entry.balance
    return acc
  }, [])
})

const principalPaid = computed(() => props.result?.schedule.filter(e => e.paid).reduce((acc, e) => acc + e.principal, 0) ?? 0)
const interestPaid = computed(() => props.result?.schedule.filter(e => e.paid).reduce((acc, e) => acc + e.interest, 0) ?? 0)
</script>

<template>
  <Card>
    <div v-if="!result" class="min-h-[400px]">
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>Your payment schedule will appear here.</CardDescription>
      </CardHeader>
      <CardContent class="flex items-center justify-center min-h-[300px]">
        <div class="text-center text-muted-foreground">
          <Calculator class="mx-auto h-12 w-12" />
          <p class="mt-4">Adjust the form to see your schedule.</p>
        </div>
      </CardContent>
    </div>

    <template v-else>
      <CardHeader>
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <CardTitle>Amortization Results</CardTitle>
            <CardDescription>A detailed breakdown of your loan payments over time.</CardDescription>
          </div>
          <Tabs v-model="view" class="print-hidden">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent class="pt-6"><div class="flex items-center justify-between pb-2"><h4 class="text-sm font-medium">Monthly Payment</h4><Receipt class="h-4 w-4 text-muted-foreground" /></div><div class="text-2xl font-bold">{{ formatCurrency(result.monthlyPayment, currency) }}</div></CardContent></Card>
          <Card><CardContent class="pt-6"><div class="flex items-center justify-between pb-2"><h4 class="text-sm font-medium">Total Interest</h4><PiggyBank class="h-4 w-4 text-muted-foreground" /></div><div class="text-2xl font-bold">{{ formatCurrency(result.totalInterest, currency) }}</div></CardContent></Card>
          <Card><CardContent class="pt-6"><div class="flex items-center justify-between pb-2"><h4 class="text-sm font-medium">Total Cost</h4><Landmark class="h-4 w-4 text-muted-foreground" /></div><div class="text-2xl font-bold">{{ formatCurrency(result.totalPayment, currency) }}</div></CardContent></Card>
          <Card><CardContent class="pt-6"><div class="flex items-center justify-between pb-2"><h4 class="text-sm font-medium">Principal Paid</h4><TrendingUp class="h-4 w-4 text-muted-foreground" /></div><div class="text-2xl font-bold">{{ formatCurrency(principalPaid, currency) }}</div></CardContent></Card>
        </div>

        <Separator />

        <div class="space-y-2">
          <h3 class="font-semibold flex items-center gap-2"><CalendarClock class="w-4 h-4" />Report Generated</h3>
          <p class="text-sm text-muted-foreground">{{ reportDate }}</p>
        </div>

        <div v-if="comments" class="space-y-2">
          <Separator />
          <h3 class="font-semibold flex items-center gap-2"><MessageSquare class="w-4 h-4" />Personal Comments</h3>
          <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ comments }}</p>
        </div>

        <Separator />

        <div class="rounded-md border overflow-hidden">
          <div class="max-h-96 overflow-y-auto">
            <table v-if="view === 'monthly'" class="w-full text-sm">
              <thead class="sticky top-0 bg-muted">
                <tr class="border-b">
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Month</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Payment</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Principal</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Interest</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in result.schedule" :key="entry.month" :class="['border-b transition-colors hover:bg-muted/50', entry.paid && 'bg-secondary/40']">
                  <td class="p-4 align-middle font-medium">{{ entry.month }}</td>
                  <td class="p-4 align-middle"><div class="flex items-center gap-2"><span>{{ format(entry.paymentDate, 'MMM yyyy') }}</span><Badge v-if="entry.paid" variant="secondary">Paid</Badge></div></td>
                  <td class="p-4 align-middle text-right">{{ formatCurrency(entry.payment, currency) }}</td>
                  <td class="p-4 align-middle text-right">{{ formatCurrency(entry.principal, currency) }}</td>
                  <td class="p-4 align-middle text-right text-destructive/80">{{ formatCurrency(entry.interest, currency) }}</td>
                  <td class="p-4 align-middle text-right font-medium">{{ formatCurrency(entry.balance, currency) }}</td>
                </tr>
              </tbody>
            </table>

            <table v-else class="w-full text-sm">
              <thead class="sticky top-0 bg-muted">
                <tr class="border-b">
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Year</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Payment</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Principal</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Interest</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in yearlySchedule" :key="entry.year" class="border-b transition-colors hover:bg-muted/50">
                  <td class="p-4 align-middle font-medium">{{ entry.year }}</td>
                  <td class="p-4 align-middle text-right">{{ formatCurrency(entry.payment, currency) }}</td>
                  <td class="p-4 align-middle text-right">{{ formatCurrency(entry.principal, currency) }}</td>
                  <td class="p-4 align-middle text-right text-destructive/80">{{ formatCurrency(entry.interest, currency) }}</td>
                  <td class="p-4 align-middle text-right font-medium">{{ formatCurrency(entry.balance, currency) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </template>
  </Card>
</template>
