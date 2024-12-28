<script lang="ts">
  import {
    activeComponent,
    countdownTime,
    currentGame,
    currentQuestion,
    socket
  } from './lib/stores/index '
  import ConnectPage from './components/ConnectPage.svelte'
  import Lobby from './components/Lobby.svelte'
  import Alerts from './components/Alerts.svelte'
  import { Progressbar, Spinner } from 'flowbite-svelte'
  import QuestionMultipleChoice from './components/QuestionMultipleChoice.svelte'
  import type { Question } from './lib/models'
  import QuestionOrder from './components/QuestionOrder.svelte'
  import QuestionLetter from './components/QuestionLetter.svelte'
  import { linear } from 'svelte/easing'
  import QuestionNumber from './components/QuestionNumber.svelte'
    import { tick } from 'svelte'

  let correctAnswer = $state()
  let progress = $state(0)
  let showCountdown = $state(false)
  let timeLeft = $countdownTime
  let lastQuestionType = $state('')

  $socket.on('player-removed', () => {
    $currentGame = null
    $currentQuestion = null
    $activeComponent = 'Lobby'
  })
  $socket.on('server-info', (data) => {
    console.log(data)
    $socket.emit('message', 'Hello')
  })
  $socket.on('game-started', (data) => {
    console.log('Game is starting: ', data)
    selectQuestionType(data.type)
    $currentGame!.currentRound = 1
    $currentQuestion = data
  })

  $socket.on('next-question', (data: { question: Question; round: number }) => {
    correctAnswer = null
    console.log('Next question: ', data)
    selectQuestionType(data.question.type)
    console.log('selecting new question type ', data.question.type, $activeComponent)
    $currentGame!.currentRound = data.round
    $currentQuestion = data.question
  })

  $socket.on('countdown', () => {
    showCountdown = true
    timeLeft = $countdownTime
    updateTimer()
  })

  $socket.on('correct-answer', (data: { answer: string, full: string }) => {
    console.log('Received answer: ', data)
    correctAnswer = data.answer
    showCountdown = false
    progress = 0
  })

  $socket.on('game-joined', (data) => {
    console.log('Data on game joined: ', data)
  })

  $socket.on('game-deleted', () => {
    $currentGame = null
    $activeComponent = 'Lobby'
    $currentQuestion = null
  })

  $socket.on('game-ended', (data) => {
    console.log('Data on game ended, do with them what you will: ', data)
    $currentGame = null
    $activeComponent = 'Lobby'
    $currentQuestion = null
  })

  // $socket.on('show-score', (data) => {
  //   console.log('Show score: ', data)
  //   lastQuestionType = $activeComponent
  //   $activeComponent = 'Scoreboard'
  //   players = data
  // })

  async function sendAnswer(answer: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      $socket.emit('answer', { answer, gameId: $currentGame!.id }, (response: boolean) => {
        resolve(response)
      })
    })
  }

  function updateTimer() {
    if (timeLeft > 0) {
      timeLeft--
      progress = (($countdownTime - timeLeft) / $countdownTime) * 100
      setTimeout(updateTimer, 1000)
    } else {
      progress = 100
    }
  }

  function selectQuestionType(type: string) {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        $activeComponent = 'QuestionMultipleChoice'
        break
      case 'LETTER':
        $activeComponent = 'QuestionLetter'
        break
      case 'ORDER':
        $activeComponent = 'QuestionOrder'
        break
      case 'NUMBER':
        $activeComponent = 'QuestionNumber'
        break
    }
  }
</script>

<main class="dark">
  <div class="flex flex-col items-center justify-start overflow-hidden max-h-screen mt-10">
    <Alerts />
    {#if showCountdown}<Progressbar
        {progress}
        animate
        easing={linear}
        tweenDuration={1000}
        class="absolute bottom-0"
        color="indigo"
        size="h-6"
      />{/if}
    {#if $activeComponent === 'ConnectPage'}
      <ConnectPage />
    {/if}
    {#if $activeComponent === 'Lobby'}
      <Lobby />
    {/if}
    {#if $activeComponent === 'GameLobby'}
      {#if $currentGame && $currentGame.currentRound > 0}
        <h1 class="text-2xl font-bold text-center text-white mb-4">{$currentGame.name}</h1>
        <p>Game will continue soon.</p>
        <Spinner />
      {:else}
        <h1 class="text-2xl font-bold text-center text-white mb-4">Game is not started</h1>
        <p>Wait for host to start the game</p>
        <Spinner />
      {/if}
    {/if}
    {#if $activeComponent === 'QuestionMultipleChoice'}
      <QuestionMultipleChoice question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
    {#if $activeComponent === 'QuestionLetter'}
      <QuestionLetter question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
    {#if $activeComponent === 'QuestionOrder'}
      <QuestionOrder question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
    {#if $activeComponent === 'QuestionNumber'}
      <QuestionNumber question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
  </div>
</main>

<style>
</style>
