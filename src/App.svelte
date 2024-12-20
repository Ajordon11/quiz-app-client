<script lang="ts">
  import { activeComponent, currentGame, currentQuestion, socket } from './lib/stores/index '
  import ConnectPage from './components/ConnectPage.svelte'
  import Lobby from './components/Lobby.svelte'
  import Alerts from './components/Alerts.svelte'
  import { Spinner } from 'flowbite-svelte'
  import QuestionMultipleChoice from './components/QuestionMultipleChoice.svelte'
  import type { Question } from './lib/models'
  import QuestionOrder from './components/QuestionOrder.svelte'
  import QuestionLetter from './components/QuestionLetter.svelte'

  let correctAnswer = $state()

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

  $socket.on('next-question', (data: Question) => {
    correctAnswer = null
    console.log('Next question: ', data)
    selectQuestionType(data.type)
    // $currentGame.currentRound++;
    $currentQuestion = data
  })

  $socket.on('countown', () => {
    console.log('Countdown')
    setTimeout(() => {
      console.log('Countdown finished')
    }, 5000)
  })

  $socket.on('correct-answer', (data) => {
    console.log('Received answer: ', data)
    correctAnswer = data
  })

  function sendAnswer(answer: string) {
    $socket.emit('answer', { answer, gameId: $currentGame.id })
  }

  // todo: send answers from components, get correct answer from server, show score

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
    {#if $activeComponent === 'ConnectPage'}
      <ConnectPage />
    {/if}
    {#if $activeComponent === 'Lobby'}
      <Lobby />
    {/if}
    {#if $activeComponent === 'GameLobby'}
      <p>Game is not started</p>
      <p>Wait for host to start the game</p>
      <Spinner />
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
    <!-- {#if $activeComponent === "QuestionNumber"}
        <QuestionNumber {currentRound} question={currentQuestion} />
        {/if} -->
    <!-- {#if $activeComponent === "RoundResult"}
        <RoundResult {currentCount} results={gameResults} />
        {/if}
        {#if $activeComponent === "GameResult"}
        <GameResult results={gameResults} />
        {/if}
        {#if $activeComponent === "GameList"}
        <GameList {socket} />
        {/if}
        {#if $activeComponent === "GameSettings"}
        <GameSettings {socket} />
        {/if} -->
  </div>
</main>

<style>
</style>
