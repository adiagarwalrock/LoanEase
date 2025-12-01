<script setup lang="ts">
import LoanCalculator from '@/components/LoanCalculator.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { Github, HelpCircle, Info } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen w-full relative font-sans text-slate-900 bg-slate-50/50 selection:bg-indigo-100 selection:text-indigo-900">
    <!-- Aurora Background Effect -->
    <div class="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-30"></div>
    <div class="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <!-- Header -->
      <header class="mb-12 space-y-6">
        <div class="flex items-center gap-3">
          <Badge variant="secondary" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 px-3 py-1">MADE FOR STUDENTS</Badge>
          <Badge variant="outline" class="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1">IN BETA</Badge>
        </div>

        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div class="space-y-4 max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              LoanEase
            </h1>
            <p class="text-lg text-slate-600 leading-relaxed">
              Calculate your loan details with precision. Input your principal, rate, and duration to view detailed amortization schedules and payment summaries.
            </p>
            <div class="text-sm text-slate-500 flex items-center gap-1">
              Want a feature?
              <a href="https://github.com/adiagarwalrock/LoanEase/issues" target="_blank" class="font-medium text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1">
                Open a GitHub issue
              </a>
              so I can track it.
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" class="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" as-child>
              <a href="https://github.com/adiagarwalrock/LoanEase" target="_blank">
                <Github class="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </Button>
            <Button variant="secondary" size="sm" class="bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700">
              <HelpCircle class="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </header>

      <!-- Main Content: Loan Calculator -->
      <LoanCalculator />

      <!-- Footer -->
      <div class="mt-20 mb-10">
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 max-w-2xl mx-auto shadow-sm">
          <Info class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p class="text-sm text-amber-800 leading-relaxed">
            <span class="font-semibold">This tool is for reference purposes only.</span> Always consult your financial advisor for official guidance.
          </p>
        </div>
        <div class="text-center mt-8 text-xs text-slate-400">
          I do not store any data — everything stays in your browser.
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  @page {
    size: auto;
    margin: 20mm;
  }
}
</style>
