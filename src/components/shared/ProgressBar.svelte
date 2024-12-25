<script>
  import { Progressbar } from 'flowbite-svelte'
  import { currentGame } from '../../lib/stores/index '
  import { sineOut } from 'svelte/easing'
</script>

<div class="absolute top-0 left-0 w-screen p-5">
  {#if $currentGame}
    <h1 class="text-xl font-bold text-white inline-block float-left mt-3">{$currentGame.currentRound} / {$currentGame.rounds}</h1>
    <Progressbar
      progress={($currentGame.currentRound / $currentGame.rounds) * 100}
      color="indigo"
      tweenDuration={1500}
      easing={sineOut}
      precision={0}
    />
  {/if}
</div>
