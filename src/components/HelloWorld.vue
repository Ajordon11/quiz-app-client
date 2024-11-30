<script setup lang="ts">
// useStore and computed are automatically imported. See vite.config.ts for details.
import { state } from "@/socket";

const connected = computed(() => state.connected)
const store = useStore()
const count = computed(() => store.count)
defineProps<{
  msg: string
  optionalProp?: number
}>()

function increment() {
  store.increment()
}
</script>

<template>
  <h2>{{ msg }}</h2>
  <button @click="increment">
    <span class="i-mdi-plus-circle-outline w-5 h-5" />
    <span class="h-7 pl-1">count is: {{ count }}</span>
  </button>
  <p>State: {{ connected }}</p>
</template>
