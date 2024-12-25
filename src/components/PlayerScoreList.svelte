<script lang="ts">
  import { Badge } from 'flowbite-svelte'
  import CustomLabel from './shared/CustomLabel.svelte'

  let { players } = $props()

  // Generate gradient colors based on position
  function getGradient(index, total) {
    const greenRatio = (total - index) / total
    const redRatio = index / total
    return `linear-gradient(to right, rgba(0, 255, 0, ${greenRatio}), rgba(255, 0, 0, ${redRatio}))`
  }

  // Sort players by score in descending order
  let sortedPlayers = $derived(players.toSorted((a, b) => b.score - a.score))
</script>

<CustomLabel>Leaderboard</CustomLabel>
<div class="min-h-screen">
  <ul class="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto min-w-80">
    {#each sortedPlayers as player, index}
      <li
        class="p-1 rounded-lg flex flex-row items-center justify-between shadow-md border border-gray-700 bg-gray-800"
        style="background: {getGradient(index, sortedPlayers.length)}"
      >
        <div class="flex items-center gap-2">
          <Badge class="text-sm font-medium text-white">#{index + 1}</Badge>
          <span class="text-lg font-semibold text-white">{player.name}</span>
        </div>

        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-400">Score:</p>
          <Badge class="text-sm font-medium text-white">{player.score}</Badge>
        </div>
      </li>
    {/each}
  </ul>
</div>
