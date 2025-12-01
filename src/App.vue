<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { ref } from 'vue'

// Initialize analytics on component mount
inject()
injectSpeedInsights()

const showHelpModal = ref(false)
</script>

<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-50 via-pink-50 to-amber-50">
    <!-- Decorative Background Blobs -->
    <div class="pointer-events-none absolute inset-0 opacity-70">
      <div class="absolute -top-24 -left-16 w-80 h-80 bg-pink-200/60 rounded-[40%] blur-3xl rotate-6"></div>
      <div class="absolute top-16 -right-20 w-96 h-96 bg-blue-200/40 rounded-[35%] blur-3xl -rotate-12"></div>
      <div class="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-200/40 rounded-full blur-[120px]"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10">
      <div class="container-custom py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span class="fun-pill bg-white/70 text-sky-700 shadow">Made for students</span>
            <span class="fun-pill bg-white/70 text-amber-600 shadow mt-2 inline-block">In Beta</span>
            <h1 class="text-4xl md:text-5xl font-black text-slate-900 mt-3 drop-shadow-sm">
              LoanEase
            </h1>
            <p class="mt-2 text-sm text-gray-600 max-w-xl">
              Calculate your loan details with precision. Input your principal, rate, and duration to view detailed
              amortization schedules and payment summaries.
            </p>
            <p class="mt-1 text-sm text-gray-600 max-w-xl">
              I am open to contributions! Check out the GitHub repo.
            </p>
            <p class="mt-1 text-s text-gray-500 max-w-xl">
              Want a feature?
              <a
                href="https://github.com/adiagarwalrock/LoanEase/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Open a GitHub issue
              </a>
              so I can track it.
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <a
              href="https://github.com/adiagarwalrock/LoanEase"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <svg
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.5c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                />
              </svg>
              View on GitHub
            </a>
            <Button
              variant="outline"
              @click="showHelpModal = true"
            >
              Help
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </template>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container-custom py-6 relative z-10">
      <RouterView />

      <!-- Footer -->
      <div class="mt-12 text-center text-sm text-gray-600">
        <p class="font-medium text-yellow-700 bg-white/70 border border-yellow-200 rounded-md p-3 inline-block shadow">
          ⚠️ This tool is for reference purposes only. Always consult your financial advisor for official guidance.
        </p>
        <p class="mt-4 text-xs text-gray-500">
          I do not store any data — everything stays in your browser.
        </p>
      </div>
    </main>

    <!-- Help Modal (placeholder for future) -->
    <div v-if="showHelpModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-900">How to Use LoanEase</h2>
          <Button
            variant="ghost"
            size="icon"
            @click="showHelpModal = false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div class="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <p class="text-xs font-semibold tracking-wide text-sky-600 uppercase">About Loan Calculations</p>
            <article class="mt-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-[13px] shadow-sm">
              <p class="text-slate-600">
                LoanEase helps you understand your loan repayment schedule by calculating:
              </p>
              <dl class="mt-3 grid gap-2 text-slate-700">
                <div class="flex items-center justify-between bg-white rounded-xl px-3 py-2 shadow">
                  <dt>Monthly Payments</dt>
                  <dd class="font-semibold">Fixed or Variable</dd>
                </div>
                <div class="flex items-center justify-between bg-white rounded-xl px-3 py-2 shadow">
                  <dt>Interest Types</dt>
                  <dd class="font-semibold">Simple or Compound</dd>
                </div>
                <div class="flex items-center justify-between bg-white rounded-xl px-3 py-2 shadow">
                  <dt>Total Interest</dt>
                  <dd class="font-semibold">Over Loan Term</dd>
                </div>
              </dl>
            </article>
          </section>

          <section>
            <p class="text-xs font-semibold tracking-wide text-sky-600 uppercase">How to use</p>
            <article
              class="mt-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 px-4 py-3 shadow"
            >
              <ol class="space-y-2 text-slate-700 list-decimal list-inside">
                <li>Enter your loan principal amount</li>
                <li>Set the annual interest rate</li>
                <li>Choose your loan term (in years)</li>
                <li>Select interest type (simple or compound)</li>
                <li>View your amortization schedule and payment breakdown</li>
                <li>Export or print your schedule for future reference</li>
              </ol>
            </article>
          </section>

          <section>
            <p class="text-xs font-semibold tracking-wide text-sky-600 uppercase">Important notes</p>
            <article
              class="mt-2 rounded-2xl border border-yellow-100 bg-yellow-50/60 px-4 py-3 text-[13px] text-yellow-900 shadow"
            >
              <ul class="space-y-1">
                <li>All calculations stay in your browser—nothing is uploaded.</li>
                <li>This tool is for educational and reference purposes only.</li>
                <li>Always verify calculations with your lender.</li>
                <li>Consult a financial advisor for official guidance.</li>
              </ul>
            </article>
          </section>
        </div>

        <div class="flex justify-end mt-6">
          <Button
            @click="showHelpModal = false"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Container with custom padding */
.container-custom {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container-custom {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Glass card effect */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Fun pill badges */
.fun-pill {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-right: 0.5rem;
}

/* Primary color utility */
.text-primary-600 {
  color: #0284c7;
}

.text-primary-700 {
  color: #0369a1;
}

.bg-primary-600 {
  background-color: #0284c7;
}

.bg-primary-700 {
  background-color: #0369a1;
}

@media print {
  @page {
    size: auto;
    margin: 20mm;
  }
}
/* Fix for large currency amounts in summary cards */
/* Ensures text wraps and doesn't get cut off when numbers are large */
main [class*="text-3xl"],
main [class*="text-4xl"],
main [class*="text-5xl"] {
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
  line-height: 1.2;
  padding-bottom: 0.1em;
  /* Prevent descenders from being cut off */
  height: auto;
  /* Ensure height grows with content */
}

/* Specific fix for the card layout to allow expansion */
main .grid>div {
  min-width: 0;
  /* Allows flex/grid children to shrink below content size if needed to force wrap */
}
</style>
