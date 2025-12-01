<script setup lang="ts">
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

// Initialize analytics on component mount
inject()
injectSpeedInsights()
</script>

<template>
  <slot />
</template>
