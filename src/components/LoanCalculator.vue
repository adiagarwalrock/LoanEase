<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AmortizationResult } from '@/lib/types'
import LoanForm from './LoanForm.vue'
import AmortizationDisplay from './AmortizationDisplay.vue'
import { generateAmortizationSchedule } from '@/lib/calculator'

const result = ref<AmortizationResult | null>(null)
const currency = ref('USD')
const comments = ref('')
const error = ref<string | null>(null)

const handleCalculation = async (values: any) => {
  const { data, error: calcError } = await generateAmortizationSchedule(values)
  if (calcError) {
    result.value = null
    error.value = calcError
  } else {
    result.value = data ?? null
    error.value = null
  }
}

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="mx-auto grid w-full max-w-7xl items-start gap-6 p-4 md:grid-cols-2 md:p-8 lg:grid-cols-3 print-hidden">
    <div class="flex flex-col gap-6 lg:col-span-1">
      <LoanForm
        :currency="currency"
        :comments="comments"
        @calculate="handleCalculation"
        @update:currency="currency = $event"
        @update:comments="comments = $event"
        @print="handlePrint"
      />
    </div>
    <div class="flex flex-col gap-6 lg:col-span-2">
      <div v-if="error" class="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
        <strong>Error:</strong> {{ error }}
      </div>
      <AmortizationDisplay
        :result="result"
        :currency="currency"
        :comments="comments"
      />
    </div>
  </div>
</template>
