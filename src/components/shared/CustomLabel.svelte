<script>
  import { BookOpenSolid } from 'flowbite-svelte-icons'
</script>

<div class="absolute top-0 p-5">
  <div>
    <BookOpenSolid color="white" size="xl" class="inline-block m-2 mb-5" />
    <h1 class="text-4xl font-bold text-white inline-block">
      <slot />
    </h1>
  </div>
</div>
