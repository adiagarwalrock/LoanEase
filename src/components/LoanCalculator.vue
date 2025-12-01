<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AmortizationResult } from '@/lib/types'
import LoanForm from './LoanForm.vue'
import AmortizationDisplay from './AmortizationDisplay.vue'
import { generateAmortizationSchedule } from '@/lib/calculator'
import { format } from 'date-fns'

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

const handleExportExcel = async () => {
  if (!result.value) return

  // Dynamically import xlsx only when needed
  const XLSX = await import('xlsx')

  const data = result.value.schedule.map(entry => ({
    Month: entry.month,
    Date: format(entry.paymentDate, 'MMM yyyy'),
    Payment: entry.payment,
    Principal: entry.principal,
    Interest: entry.interest,
    Balance: entry.balance,
    Status: entry.paid ? 'Paid' : 'Pending'
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule')
  XLSX.writeFile(wb, 'Amortization_Schedule.xlsx')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Top Section: Loan Form -->
    <div class="no-print w-full">
      <div class="glass-card p-4 md:p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            Enter Your Information
          </h2>
          <p class="text-sm text-gray-600">
            Provide your loan parameters to calculate your repayment schedule.
          </p>
        </div>

        <LoanForm
          :currency="currency"
          :comments="comments"
          @calculate="handleCalculation"
          @update:currency="currency = $event"
          @update:comments="comments = $event"
          @print="handlePrint"
          @export-excel="handleExportExcel"
        />
      </div>
    </div>

    <!-- Bottom Section: Results -->
    <div class="space-y-6 w-full">
      <!-- Error Message -->
      <div v-if="error" class="glass-card p-4 bg-red-50/80 border-red-200">
        <p class="text-red-800 text-sm">
          <strong>Error:</strong> {{ error }}
        </p>
      </div>

      <!-- Amortization Display -->
      <div class="glass-card p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">
            Loan Summary & Schedule
          </h2>
        </div>

        <AmortizationDisplay
          :result="result"
          :currency="currency"
          :comments="comments"
          @print="handlePrint"
          @export-excel="handleExportExcel"
        />
      </div>
    </div>
  </div>
</template>
