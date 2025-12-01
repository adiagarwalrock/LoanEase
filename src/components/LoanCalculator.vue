<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AmortizationResult } from '@/lib/types'
import LoanForm from './LoanForm.vue'
import AmortizationDisplay from './AmortizationDisplay.vue'
import { generateAmortizationSchedule } from '@/lib/calculator'
import * as XLSX from 'xlsx'
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

const handleExportExcel = () => {
  if (!result.value) return

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
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Column: Loan Form -->
    <div class="no-print">
      <div class="glass-card p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Enter Your Information
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          Provide your loan parameters to calculate your repayment schedule.
        </p>

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

    <!-- Right Column: Results -->
    <div class="space-y-6">
      <!-- Error Message -->
      <div v-if="error" class="glass-card p-4 bg-red-50/80 border-red-200">
        <p class="text-red-800 text-sm">
          <strong>Error:</strong> {{ error }}
        </p>
      </div>

      <!-- Amortization Display -->
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">
            Loan Summary & Schedule
          </h2>
        </div>

        <AmortizationDisplay
          :result="result"
          :currency="currency"
          :comments="comments"
        />
      </div>
    </div>
  </div>
</template>
