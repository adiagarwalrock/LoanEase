<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import type { TabsRootProps } from 'radix-vue'

const props = defineProps<TabsRootProps>()
</script>

<template>
  <TabsRoot v-bind="props">
    <slot />
  </TabsRoot>
</template>
