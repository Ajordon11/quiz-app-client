<script lang="ts">
  import { Button } from 'flowbite-svelte'
  import { PlayOutline, RefreshOutline } from 'flowbite-svelte-icons'
  import QuestionText from './shared/QuestionText.svelte'
  import ProgressBar from './shared/ProgressBar.svelte'
  import { untrack } from 'svelte'

  let currentOrder = $state(0)
  let answer = $state('')
  let allSelected = $state(false)
  let answerSent = $state(false)
  let answerReceived = $state(false)

  const { question, sendAnswer, correctAnswer } = $props()
  let buttons: any[] = $state(
    question.options.map((option: string) => ({
      selected: false,
      order: 0,
      color: 'light',
      disabled: false,
      option
    }))
  )

  function chooseOrder(index: number) {
    // disable all except last selected
    buttons.forEach((button, i) => {
      if (i !== index && button.selected) {
        button.disabled = true
      }
    })
    if (buttons[index].selected) {
      // already selected, unselect and allow the same for previously selected
      allSelected = false
      buttons[index].selected = false
      buttons[index].order = 0
      buttons[index].color = 'light'
      currentOrder--
      buttons.find((button) => button.order === currentOrder).disabled = false
      return
    }
    if (currentOrder < question.options.length) {
      // new selection
      currentOrder++
      buttons[index].selected = true
      buttons[index].order = currentOrder
      buttons[index].color = 'blue'
      if (currentOrder === question.options.length) {
        // last selected
        allSelected = true
      }
    }
  }

  async function confirmAnswer() {
    buttons.forEach((button) => (button.disabled = true))
    answer = buttons
      .toSorted((a, b) => (a.order > b.order ? 1 : -1))
      .map((btn) => btn.option)
      .join(',')
    answerSent = true
    answerReceived = await sendAnswer(answer)
  }

  $effect(() => {
    if (question) {
      buttons = question.options.map((option: string) => ({
        selected: false,
        order: 0,
        color: 'light',
        disabled: false,
        option
      }))
      answerSent = false
      answerReceived = false
      currentOrder = 0
      allSelected = false
      answer = ''
    }
  })

  $effect(() => {
    if (!correctAnswer) {
      return
    }
    untrack(() => {
      answerSent = true
      buttons.forEach((button) => (button.disabled = true))
      const correctAnswerString =
        typeof correctAnswer === 'string' ? correctAnswer : correctAnswer.join(',')
      if (correctAnswerString === answer && answerReceived) {
        buttons.forEach((button) => (button.color = 'green'))
      } else {
        buttons.forEach((button) => (button.color = 'red'))
      }
      answerReceived = false
    })
  })

  function reset(): void {
    currentOrder = 0
    buttons.forEach((button) => (button.disabled = false))
    buttons = question.options.map((option: string) => ({
      selected: false,
      order: 0,
      color: 'light',
      option
    }))
  }
</script>

<ProgressBar />
<div class="h-max flex flex-col justify-center items-center">
  <QuestionText>{question.question}</QuestionText>
  <div class="mt-5">
    <Button size="lg" color="dark" on:click={() => reset()} disabled={answerSent}
      ><RefreshOutline class="w-5 h-5 me-2" />Reset</Button
    >
    <Button
      size="lg"
      color="dark"
      on:click={() => confirmAnswer()}
      disabled={!allSelected || answerSent}><PlayOutline class="w-5 h-5 me-2" />Confirm</Button
    >
  </div>
  {#each question.options as option, index}
    <Button
      pill
      class="w-full h-20 mt-5 disabled: opacity-90"
      disabled={buttons[index].disabled}
      color={buttons[index].color}
      id={option}
      on:click={() => chooseOrder(index)}
      >{option}
      {buttons[index].order !== 0 ? `(${buttons[index].order})` : ''}</Button
    >
  {/each}
</div>
