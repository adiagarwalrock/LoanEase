<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Banknote, CalendarDays, Percent, Printer, MessageSquare, Calendar } from 'lucide-vue-next'
import { LoanSchema, type LoanFormValues } from '@/lib/types'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import Label from './ui/Label.vue'
import Select from './ui/Select.vue'
import Textarea from './ui/Textarea.vue'
import Slider from './ui/Slider.vue'
import Switch from './ui/Switch.vue'
import Separator from './ui/Separator.vue'

const props = defineProps<{
  currency: string
  comments: string
}>()

const emit = defineEmits<{
  calculate: [values: LoanFormValues]
  'update:currency': [value: string]
  'update:comments': [value: string]
  print: []
}>()

const principal = ref(100000)
const interestRate = ref(5)
const loanTerm = ref(30)
const interestType = ref<'compound' | 'simple'>('compound')
const startDate = ref(new Date().toISOString().split('T')[0])

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const calculateSchedule = () => {
  const values = {
    principal: principal.value,
    interestRate: interestRate.value,
    loanTerm: loanTerm.value,
    interestType: interestType.value,
    startDate: new Date(startDate.value),
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
  <Card>
    <CardHeader>
      <CardTitle>Loan Details</CardTitle>
      <CardDescription>Enter your loan information to see the schedule.</CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
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
      <div class="space-y-4">
        <Label class="flex items-center gap-2">
          <CalendarDays class="h-4 w-4 text-muted-foreground" />
          Loan Term (Years): {{ loanTerm }}
        </Label>
        <Slider
          :model-value="[loanTerm]"
          @update:model-value="(v) => { if (v?.[0]) loanTerm = v[0] }"
          :min="1"
          :max="40"
          :step="1"
        />
      </div>

      <!-- Start Date -->
      <div class="space-y-2">
        <Label>Loan Start Date</Label>
        <div class="relative">
          <Calendar class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
          <Input
            v-model="startDate"
            type="date"
            class="pl-8"
          />
        </div>
      </div>

      <!-- Interest Type -->
      <div class="space-y-2">
        <Label>Interest Type</Label>
        <div class="flex items-center gap-3">
          <span :class="['text-sm transition-colors', interestType === 'simple' ? 'text-foreground font-medium' : 'text-muted-foreground']">Simple</span>
          <Switch
            :checked="interestType === 'compound'"
            @update:checked="(checked) => interestType = checked ? 'compound' : 'simple'"
          />
          <span :class="['text-sm transition-colors', interestType === 'compound' ? 'text-foreground font-medium' : 'text-muted-foreground']">Compound</span>
        </div>
      </div>

      <Separator />

      <!-- Currency -->
      <div class="space-y-2">
        <Label>Report Settings</Label>
        <Select :model-value="currency" @update:model-value="emit('update:currency', $event)">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="INR">INR (₹)</option>
        </Select>
      </div>

      <!-- Comments -->
      <div class="space-y-2">
        <Label>Personal Comments</Label>
        <div class="relative">
          <MessageSquare class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
          <Textarea
            :model-value="comments"
            @update:model-value="emit('update:comments', $event)"
            placeholder="Add notes for your report..."
            class="pl-8"
          />
        </div>
      </div>

      <!-- Print Button -->
      <Button @click="emit('print')" variant="outline" class="w-full">
        <Printer class="mr-2 h-4 w-4" />
        Print / Save as PDF
      </Button>
    </CardContent>
  </Card>
</template>
