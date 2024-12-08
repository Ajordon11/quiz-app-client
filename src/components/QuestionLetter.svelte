<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { getAlphabet } from "../lib/stores/index ";
  import { untrack } from "svelte";
  import QuestionText from "./shared/QuestionText.svelte";
  import ProgressBar from "./shared/ProgressBar.svelte";

  const { question, sendAnswer, correctAnswer } = $props();
  const alphabet = getAlphabet();
  let disabled = $state(false);
  let buttonsColor: any[] = $state(alphabet.map(() => "light"));
  let selectedAnswer = $state({
    answer: "",
    index: -1,
  });

  function selectAnswer(letter: string, index: number) {
    disabled = true;
    buttonsColor[index] = "blue";
    sendAnswer(letter);
    selectedAnswer = { answer: letter, index };
  }

  $effect(() => {
    if (!correctAnswer) {
      return;
    }
    disabled = true;
    untrack(() => {
      if (correctAnswer === selectedAnswer.answer) {
        buttonsColor[selectedAnswer.index] = "green";
      } else if (selectedAnswer.index === -1) {
        // nothing selected
        buttonsColor = alphabet.map(() => "red");
        const correctIndex = alphabet.indexOf(correctAnswer);
        buttonsColor[correctIndex] = "green";
      } else {
        buttonsColor[selectedAnswer.index] = "red";
        const correctIndex = alphabet.indexOf(correctAnswer);
        buttonsColor[correctIndex] = "green";
      }
    });
  });
</script>

<ProgressBar />
<QuestionText>{question.question}</QuestionText>
<div class="max-h-screen flex items-center justify-center w-full">
  <div class="grid grid-cols-4 gap-2 p-4 w-full max-w-md sm:max-w-lg">
    {#each alphabet as letter, index}
      <Button
        {disabled}
        on:click={() => selectAnswer(letter, index)}
        color={buttonsColor[index]}
        class="w-full h-20 {selectedAnswer.index === index ? 'disabled: opacity-100' : ''}"
      >
        {letter}
      </Button>
    {/each}
  </div>
</div>
