<script setup lang="ts">
// See vite.config.ts for details about automatic imports
import { useConnectionStore } from "@/connection";
import { socket } from "@/socket";

const route = useRoute();
const connectionStore = useConnectionStore();

socket.off();

connectionStore.bindEvents();
useHead({
  title: () => route.meta.title || 'Quiz App Client',
  meta: [
    {
      property: 'og:title',
      content: () => route.meta.title,
    },
    {
      name: 'twitter:title',
      content: () => route.meta.title,
    },
  ],
})
</script>
<template>
  <router-view />
</template>
