<script lang="ts">
  import { Alert } from "flowbite-svelte";
  import { fly } from "svelte/transition";
  import { alerts } from "../lib/stores/alerts";
</script>

{#if $alerts.length > 0}
  {#each $alerts as alert}
    <Alert
      color={alert.color}
      dismissable={alert.dismissable}
      transition={fly}
      params={{ x: 200 }}
    >
      <span class="font-medium">{alert.title}</span>
      {alert.message}
    </Alert>
  {/each}
{/if}
