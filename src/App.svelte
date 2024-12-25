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
  import type { Player, Question } from './lib/models'
  import QuestionOrder from './components/QuestionOrder.svelte'
  import QuestionLetter from './components/QuestionLetter.svelte'
  import { linear } from 'svelte/easing'
  import QuestionNumber from './components/QuestionNumber.svelte'
  import PlayerScoreList from './components/PlayerScoreList.svelte'

  let correctAnswer = $state()
  let progress = $state(0)
  let showCountdown = $state(false)
  let timeLeft = $countdownTime
  let players: Player[] = $state([])
  let lastQuestionType  = $state('')


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
    $currentGame!.currentRound++
    $currentQuestion = data
  })

  $socket.on('countdown', () => {
    console.log('Countdown')
    showCountdown = true
    timeLeft = $countdownTime
    updateTimer()
  })

  $socket.on('correct-answer', (data) => {
    console.log('Received answer: ', data)
    correctAnswer = data
    showCountdown = false
    progress = 0
    if ($activeComponent === 'Scoreboard') {
      $activeComponent = lastQuestionType
    }
  })

  $socket.on('game-joined', (data) => {
    console.log('Data on game joined: ', data)
  })

  $socket.on('show-score', (data) => {
    console.log('Show score: ', data)
    lastQuestionType = $activeComponent
    $activeComponent = 'Scoreboard'
    players = data
  })

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
      console.log('countdown', timeLeft, progress)
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
    {#if $activeComponent === 'QuestionNumber'}
      <QuestionNumber question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
    {#if $activeComponent === 'Scoreboard'}
      <PlayerScoreList {players}/>
    {/if}
  </div>
</main>

<style>
</style>
