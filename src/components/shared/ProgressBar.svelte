<script>
  import { Progressbar } from 'flowbite-svelte'
  import { currentGame } from '../../lib/stores/index '
  import { sineOut } from 'svelte/easing'
</script>

<div class="absolute top-0 left-0 w-screen p-5">
  <Progressbar
    progress={($currentGame.currentRound / $currentGame.rounds) * 100}
    color="indigo"
    tweenDuration={1500}
    easing={sineOut}
    labelOutside="{$currentGame.currentRound} / {$currentGame.rounds}"
    class="mb-5"
  />
</div>
