<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { Maximize2 } from 'lucide-vue-next'
import type { AmortizationResult, AmortizationEntry } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Tabs from './ui/Tabs.vue'
import TabsList from './ui/TabsList.vue'
import TabsTrigger from './ui/TabsTrigger.vue'
import Badge from './ui/Badge.vue'
import Button from './ui/Button.vue'

const props = defineProps<{
  result: AmortizationResult
  currency: string
  heightClass?: string
  showExpand?: boolean
}>()

const emit = defineEmits<{
  (e: 'expand'): void
}>()

const view = ref('monthly')

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
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <Tabs v-model="view" class="w-full sm:w-auto">
        <TabsList class="relative grid w-full grid-cols-2 sm:w-auto h-12 bg-muted p-1.5 rounded-full border">
          <div
            :class="[
              'absolute inset-y-1.5 rounded-full bg-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
              'w-[calc(50%-0.375rem)]',
              view === 'monthly' ? 'left-1.5' : 'left-[50%]'
            ]"
          ></div>
          <TabsTrigger 
            value="monthly" 
            class="z-10 rounded-full bg-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground transition-colors duration-200"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger 
            value="yearly" 
            class="z-10 rounded-full bg-transparent text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground transition-colors duration-200"
          >
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button v-if="showExpand" variant="outline" size="sm" @click="emit('expand')" class="gap-2 ml-4">
        <Maximize2 class="h-4 w-4" />
        Expand
      </Button>
    </div>

    <div class="rounded-md border overflow-hidden">
      <div :class="['overflow-y-auto', heightClass || 'max-h-96']">
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
  </div>
</template>
