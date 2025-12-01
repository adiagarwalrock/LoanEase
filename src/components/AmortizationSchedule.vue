<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { format } from 'date-fns'
import { Maximize2 } from 'lucide-vue-next'
import {
  useVueTable,
  getCoreRowModel,
  FlexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/vue-table'
import type { AmortizationResult, AmortizationEntry } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Tabs from './ui/Tabs.vue'
import TabsList from './ui/TabsList.vue'
import TabsTrigger from './ui/TabsTrigger.vue'
import Badge from './ui/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

const monthlyColumnHelper = createColumnHelper<AmortizationEntry>()
const yearlyColumnHelper = createColumnHelper<YearlyEntry>()

const monthlyColumns = computed(() => [
  monthlyColumnHelper.accessor('month', {
    header: 'Month',
    cell: info => info.getValue(),
    meta: { class: 'w-[80px]' }
  }),
  monthlyColumnHelper.accessor('paymentDate', {
    header: 'Date',
    cell: info => {
      const date = format(info.getValue(), 'MMM yyyy')
      const isPaid = info.row.original.paid
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', date),
        isPaid ? h(Badge, { variant: 'secondary' }, () => 'Paid') : null
      ])
    },
  }),
  monthlyColumnHelper.accessor('payment', {
    header: () => h('div', { class: 'text-right' }, 'Payment'),
    cell: info => h('div', { class: 'text-right' }, formatCurrency(info.getValue(), props.currency)),
  }),
  monthlyColumnHelper.accessor('principal', {
    header: () => h('div', { class: 'text-right' }, 'Principal'),
    cell: info => h('div', { class: 'text-right' }, formatCurrency(info.getValue(), props.currency)),
  }),
  monthlyColumnHelper.accessor('interest', {
    header: () => h('div', { class: 'text-right' }, 'Interest'),
    cell: info => h('div', { class: 'text-right text-destructive/80' }, formatCurrency(info.getValue(), props.currency)),
  }),
  monthlyColumnHelper.accessor('balance', {
    header: () => h('div', { class: 'text-right' }, 'Balance'),
    cell: info => h('div', { class: 'text-right font-medium' }, formatCurrency(info.getValue(), props.currency)),
  }),
])

const yearlyColumns = computed(() => [
  yearlyColumnHelper.accessor('year', {
    header: 'Year',
    cell: info => info.getValue(),
    meta: { class: 'w-[80px]' }
  }),
  yearlyColumnHelper.accessor('payment', {
    header: () => h('div', { class: 'text-right' }, 'Total Payment'),
    cell: info => h('div', { class: 'text-right' }, formatCurrency(info.getValue(), props.currency)),
  }),
  yearlyColumnHelper.accessor('principal', {
    header: () => h('div', { class: 'text-right' }, 'Principal'),
    cell: info => h('div', { class: 'text-right' }, formatCurrency(info.getValue(), props.currency)),
  }),
  yearlyColumnHelper.accessor('interest', {
    header: () => h('div', { class: 'text-right' }, 'Interest'),
    cell: info => h('div', { class: 'text-right text-destructive/80' }, formatCurrency(info.getValue(), props.currency)),
  }),
  yearlyColumnHelper.accessor('balance', {
    header: () => h('div', { class: 'text-right' }, 'Ending Balance'),
    cell: info => h('div', { class: 'text-right font-medium' }, formatCurrency(info.getValue(), props.currency)),
  }),
])

const columns = computed(() => view.value === 'monthly' ? monthlyColumns.value : yearlyColumns.value)
const data = computed(() => view.value === 'monthly' ? props.result.schedule : yearlySchedule.value)

const table = useVueTable({
  get data() { return data.value },
  get columns() { return columns.value as ColumnDef<AmortizationEntry | YearlyEntry>[] },
  getCoreRowModel: getCoreRowModel(),
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

      <Button v-if="showExpand" size="sm" @click="emit('expand')" class="ml-4">
        Expand
        <template #icon>
          <Maximize2 class="h-4 w-4" />
        </template>
      </Button>
    </div>

    <div class="rounded-md border overflow-hidden">
      <div :class="['overflow-y-auto', heightClass || 'max-h-96']">
        <Table>
          <TableHeader class="sticky top-0 bg-muted z-10">
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id" :class="(header.column.columnDef.meta as any)?.class">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
                :class="[
                  'transition-colors hover:bg-muted/50', 
                  // Use type assertion or check property existence safely if needed, 
                  // but for 'paid' styling we need to access the original data.
                  (row.original as any).paid ? 'bg-secondary/40' : '' 
                ]"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
