<script lang="ts">
  import { Button } from 'flowbite-svelte'
  import { untrack } from 'svelte'
  import QuestionText from './shared/QuestionText.svelte'
  import ProgressBar from './shared/ProgressBar.svelte'

  let disabled = $state(false)
  let selectedAnswer = $state({
    answer: '',
    index: -1
  })
  const { question, sendAnswer, correctAnswer } = $props()
  let buttonsColor: any[] = $state(question.options.map(() => 'light'))

  async function chooseAnswer(answer: string, index: number) {
    console.log(answer, index)
    disabled = true
    const received = await sendAnswer(answer)
    if (!received) {
      return
    }
    buttonsColor[index] = 'blue'
    selectedAnswer = { answer, index }
  }

  $effect(() => {
    if (question) {
      selectedAnswer = { answer: '', index: -1 }
      buttonsColor = question.options.map(() => 'light')
      disabled = false
    }
  })
  
  $effect(() => {
    if (!correctAnswer) {
      return
    }
    console.log('effect called')
    disabled = true
    untrack(() => {
      if (correctAnswer === selectedAnswer.answer) {
        buttonsColor[selectedAnswer.index] = 'green'
      } else if (selectedAnswer.index === -1) {
        // nothing selected
        buttonsColor = question.options.map(() => 'red')
        const correctIndex = question.options.indexOf(correctAnswer)
        buttonsColor[correctIndex] = 'green'
      } else {
        buttonsColor[selectedAnswer.index] = 'red'
        const correctIndex = question.options.indexOf(correctAnswer)
        buttonsColor[correctIndex] = 'green'
      }
    })
  })
</script>

<ProgressBar />
<div class="h-max flex flex-col justify-center items-center">
  <QuestionText>{question.question}</QuestionText>
  {#each question.options as option, index}
    <Button
      pill
      class="w-full h-20 mt-5 {selectedAnswer.index === index ? 'disabled: opacity-100' : ''}"
      disabled={disabled || null}
      color={buttonsColor[index]}
      id={option}
      on:click={() => chooseAnswer(option, index)}>{option}</Button
    >
  {/each}
</div>
