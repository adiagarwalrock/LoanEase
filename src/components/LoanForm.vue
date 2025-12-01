<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Banknote, CalendarDays, Percent, MessageSquare, Calendar as CalendarIcon } from 'lucide-vue-next'
import { LoanSchema, type LoanFormValues } from '@/lib/types'
import { format } from 'date-fns'
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/button/Button.vue'
import Input from './ui/Input.vue'
import Label from './ui/Label.vue'
import Select from './ui/Select.vue'
import Textarea from './ui/Textarea.vue'
import Separator from './ui/Separator.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

const props = defineProps<{
  currency: string
  comments: string
}>()

const emit = defineEmits<{
  calculate: [values: LoanFormValues]
  'update:currency': [value: string]
  'update:comments': [value: string]
}>()

const principal = ref(100000)
const interestRate = ref(5)
const loanTerm = ref(30)
const interestType = ref<'compound' | 'simple'>('simple')
const startDate = ref<any>(today(getLocalTimeZone()))

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const calculateSchedule = () => {
  const values = {
    principal: principal.value,
    interestRate: interestRate.value,
    loanTerm: loanTerm.value,
    interestType: interestType.value,
    startDate: startDate.value ? startDate.value.toDate(getLocalTimeZone()) : new Date(),
  }

  const result = LoanSchema.safeParse(values)
  if (result.success) {
    emit('calculate', result.data)
  }
}

const debouncedCalculate = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(calculateSchedule, 500)
}

watch([principal, interestRate, loanTerm, interestType, startDate], debouncedCalculate)

onMounted(() => {
  calculateSchedule()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Primary Inputs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- Loan Principal -->
      <div class="space-y-2">
        <Label>Loan Principal ({{ currency }})</Label>
        <div class="relative">
          <Banknote class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model.number="principal"
            type="number"
            step="1000"
            placeholder="e.g., 250000"
            class="pl-8"
          />
        </div>
      </div>

      <!-- Interest Rate -->
      <div class="space-y-2">
        <Label>Annual Interest Rate (%)</Label>
        <div class="relative">
          <Percent class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model.number="interestRate"
            type="number"
            step="0.01"
            placeholder="e.g., 6.5"
            class="pl-8"
          />
        </div>
      </div>

      <!-- Loan Term -->
      <div class="space-y-2">
        <Label>Loan Term (Years)</Label>
        <div class="relative">
          <CalendarDays class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model.number="loanTerm"
            type="number"
            min="1"
            max="50"
            step="1"
            class="pl-8"
          />
        </div>
      </div>

      <!-- Start Date -->
      <div class="space-y-2">
        <Label>Loan Start Date</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="cn(
                'w-full justify-start text-left font-normal flex items-center',
                !startDate && 'text-muted-foreground',
              )"
            >
              <CalendarIcon class="mr-2 h-4 w-4 opacity-50" />
              <span class="whitespace-nowrap">{{ startDate ? format(startDate.toDate(getLocalTimeZone()), "PPP") : "Pick a date" }}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="startDate" initial-focus />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <Separator />

    <!-- Secondary Settings Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
      <!-- Interest Type -->
      <div class="space-y-2">
        <Label>Interest Type</Label>
        <Select v-model="interestType">
          <option value="simple">Simple</option>
          <option value="compound">Compound</option>
        </Select>
      </div>

      <!-- Currency -->
      <div class="space-y-2">
        <Label>Report Currency</Label>
        <Select :model-value="currency" @update:model-value="emit('update:currency', $event)">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="INR">INR (₹)</option>
        </Select>
      </div>

       <!-- Empty div to fill space -->
      <div class="lg:col-span-2"></div>
    </div>

    <!-- Comments Section -->
    <div class="space-y-2">
        <Label>Personal Comments</Label>
        <div class="relative">
          <MessageSquare class="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground z-10" />
          <Textarea
            :model-value="comments"
            @update:model-value="emit('update:comments', $event)"
            placeholder="Add notes for your report..."
            class="pl-8 min-h-[60px]"
          />
        </div>
      </div>
  </div>
</template>
