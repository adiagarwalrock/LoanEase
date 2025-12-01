<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { useSlots, computed } from 'vue'
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <template v-if="hasIcon">
      <span :class="cn('group-hover/modal-btn:translate-x-80 group-hover/modal-btn:opacity-0', 'inline-block transition-all duration-500')">
        <slot />
      </span>
      <div class="-translate-x-80 opacity-0 group-hover/modal-btn:translate-x-0 group-hover/modal-btn:opacity-100 flex items-center justify-center absolute inset-0 transition-all duration-500 z-20">
        <slot name="icon" />
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
