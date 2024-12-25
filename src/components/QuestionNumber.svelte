<script lang="ts">
  import { Button, Input } from 'flowbite-svelte'
  import ProgressBar from './shared/ProgressBar.svelte'
  import QuestionText from './shared/QuestionText.svelte'
  import { untrack } from 'svelte'

  const { question, sendAnswer, correctAnswer } = $props()
  let disabled = $state(false)
  let answer = $state('')
  let inputColor = $state<'base' | 'green' | 'red'>('base')

  async function selectAnswer() {
    disabled = true
    const received = await sendAnswer(answer)
    if (!received) {
      return
    }
  }

  $effect(() => {
    if (!correctAnswer) {
      return
    }
    disabled = true
    untrack(() => {
      if (correctAnswer === answer) {
        inputColor = 'green'
      } else {
        inputColor = 'red'
      }
    })
  })

  const addNumber = (num: string) => {
    answer += num
  }

  const handleClear = () => {
    answer = ''
  }
</script>

<ProgressBar />
<div class="h-max flex flex-col justify-center items-center">
  <QuestionText>{question.question}</QuestionText>
  <div class="flex flex-col flex-1 justify-center gap-4 mx-auto w-full p-10">
    <Input bind:value={answer} color={inputColor} class="w-full" size="lg"></Input>
    <!-- Number Buttons -->
    <div class="grid grid-cols-3 gap-4">
      {#each ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as num}
        <Button {disabled} on:click={() => addNumber(num)} color="light" class="w-20 h-20 text-2xl">
          {num}
        </Button>
      {/each}

      <Button
        color="light"
        on:click={handleClear}
        disabled={!answer || disabled}
        class="w-20 h-20 text-lg"
      >
        Clear</Button
      >

      <!-- Zero Button -->
      <Button
        on:click={() => addNumber('0')}
        color="light"
        {disabled}
        class="bg-gray-700 hover:bg-gray-600 text-white text-2xl h-20 w-20 flex justify-center items-center"
      >
        0
      </Button>

      <Button
        on:click={() => selectAnswer()}
        disabled={!answer || disabled}
        color="light"
        class="w-20 h-20 text-lg"
      >
        Send</Button
      >
    </div>
  </div>
</div>
