<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calculator, Landmark, PiggyBank, Receipt, MessageSquare, CalendarClock, TrendingUp, X, Printer, FileSpreadsheet } from 'lucide-vue-next'
import type { AmortizationResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Separator from './ui/Separator.vue'
import Button from '@/components/ui/button/Button.vue'
import AmortizationSchedule from './AmortizationSchedule.vue'

const props = defineProps<{
  result: AmortizationResult | null
  currency: string
  comments: string
}>()

const emit = defineEmits<{
  (e: 'expand'): void
  (e: 'print'): void
  (e: 'export-excel'): void
}>()

const reportDate = ref('')
const isExpanded = ref(false)

watch(() => props.result, () => {
  reportDate.value = new Date().toLocaleString()
}, { immediate: true })

const principalPaid = computed(() => props.result?.schedule.filter(e => e.paid).reduce((acc, e) => acc + e.principal, 0) ?? 0)
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
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Summary List -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center justify-between rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
            <span class="text-sm font-medium flex items-center gap-2">
              <Receipt class="h-4 w-4 text-muted-foreground" />
              Monthly Payment
            </span>
            <span class="text-sm font-bold" :title="formatCurrency(result.monthlyPayment, currency)">
              {{ formatCurrency(result.monthlyPayment, currency) }}
            </span>
          </div>

          <div class="flex items-center justify-between rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
            <span class="text-sm font-medium flex items-center gap-2">
              <PiggyBank class="h-4 w-4 text-muted-foreground" />
              Total Interest
            </span>
            <span class="text-sm font-bold" :title="formatCurrency(result.totalInterest, currency)">
              {{ formatCurrency(result.totalInterest, currency) }}
            </span>
          </div>

          <div class="flex items-center justify-between rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
            <span class="text-sm font-medium flex items-center gap-2">
              <Landmark class="h-4 w-4 text-muted-foreground" />
              Total Cost
            </span>
            <span class="text-sm font-bold" :title="formatCurrency(result.totalPayment, currency)">
              {{ formatCurrency(result.totalPayment, currency) }}
            </span>
          </div>

          <div class="flex items-center justify-between rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
            <span class="text-sm font-medium flex items-center gap-2">
              <TrendingUp class="h-4 w-4 text-muted-foreground" />
              Principal Paid
            </span>
            <span class="text-sm font-bold" :title="formatCurrency(principalPaid, currency)">
              {{ formatCurrency(principalPaid, currency) }}
            </span>
          </div>
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

        <AmortizationSchedule :result="result" :currency="currency" :show-expand="true" @expand="isExpanded = true" />

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button @click="emit('print')" class="w-full">
                Print PDF
                <template #icon>
                    <Printer class="h-4 w-4" />
                </template>
            </Button>
            <Button @click="emit('export-excel')" class="w-full" variant="outline">
                Export Excel
                <template #icon>
                    <FileSpreadsheet class="h-4 w-4" />
                </template>
            </Button>
        </div>
      </CardContent>

      <Teleport to="body">
        <div v-if="isExpanded" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" @click="isExpanded = false">
          <div class="fixed left-[50%] top-[50%] z-50 flex flex-col w-[95vw] sm:w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg duration-200 rounded-lg sm:rounded-lg h-[90vh]" @click.stop>
            <div class="flex items-center justify-between flex-shrink-0">
              <h2 class="text-lg font-semibold">Amortization Schedule</h2>
              <Button variant="ghost" size="icon" @click="isExpanded = false">
                <X class="h-4 w-4" />
                <span class="sr-only">Close</span>
              </Button>
            </div>
            <div class="flex-1 min-h-0">
              <AmortizationSchedule :result="result" :currency="currency" height-class="h-full" />
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </Card>
</template>