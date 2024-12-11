<script lang="ts">
  import { activeComponent, socket } from '../lib/stores/index '
  import { Spinner } from 'flowbite-svelte'
  import { CheckCircleSolid } from 'flowbite-svelte-icons'
  import CustomLabel from './shared/CustomLabel.svelte'

  let connected: boolean = false

  $socket.on('connect', () => {
    console.log('Connected to server')
    connected = true
    setTimeout(() => {
      $activeComponent = 'Lobby'
    }, 3000)
  })
</script>

<CustomLabel>Connection</CustomLabel>
<div>
  {#if !connected}
    <h1 class="text-4xl font-bold mb-4">Connecting to quiz server</h1>
    <div class="text-center"><Spinner size={8} /></div>
  {/if}

  {#if connected}
    <h1 class="text-4xl font-bold mb-4">Connected to quiz server</h1>
    <div class="flex justify-center"><CheckCircleSolid size="xl" /></div>
  {/if}
</div>
