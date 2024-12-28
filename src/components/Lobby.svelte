<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Input,
    Label,
    Select,
    Spinner,
    type SelectOptionType
  } from 'flowbite-svelte'
  import {
    activeComponent,
    availableSongs,
    currentGame,
    currentQuestion,
    player,
    socket,
    URL
  } from '../lib/stores/index '
  import type { Game, Player, Question, SocketResponse } from '../lib/models'
  import { addAlert, clearAlerts } from '../lib/stores/alerts'
  import { onMount } from 'svelte'
  import Time from 'svelte-time'
  import CustomLabel from './shared/CustomLabel.svelte'

  onMount(() => {
    getAvailableGames()
    checkIfLoggedIn()
  })

  let playerConnected: boolean = false
  let name: string
  let song: string
  let loading: boolean = false
  let games: Game[] = []
  let gamesAsOptions: SelectOptionType<any>[] = []
  let codes: string[] = []

  function connectPlayer() {
    clearAlerts()
    loading = true
    $socket.emit('player-create', { name, song }, (response: SocketResponse) => {
      console.log('Response from server on player create: ', response)
      if (response.success) {
        $player = response.data.player as Player
        localStorage.setItem('playerName', $player.name)
        if ($player.song) {
          localStorage.setItem('playerSong', $player.song)
        }
        playerConnected = true
        if (response.data.game) {
          joinGameInProgress(response.data)
        }
      } else {
        addAlert({
          color: 'red',
          message: response.message,
          title: 'Login error'
        })
        loading = false
      }
    })
  }

  $socket.on('game-created', (data) => {
    console.log('New game created on server: ', data)
    getAvailableGames()
  })

  async function getAvailableGames() {
    const res = await fetch($URL + '/api/games')
    games = (await res.json()) as Game[]
    gamesAsOptions = games.map((game) => {
      return {
        name: game.name,
        value: game.id
      }
    })
    console.log(games)
    loading = false
  }

  function checkIfLoggedIn() {
    if ($player) {
      console.log('player is connected ', $player)
      playerConnected = true
    }
    if (localStorage.getItem('playerName')) {
      name = localStorage.getItem('playerName')!
    }
    if (localStorage.getItem('playerSong')) {
      song = localStorage.getItem('playerSong')!
    }
  }

  function joinGame(gameId: string, i: number) {
    clearAlerts()
    const code = codes[i]
    console.log('Joining game: ', gameId, code)
    if (gameId && code) {
      $socket.emit('game-join', { gameId, code }, (response: SocketResponse) => {
        if (response.success) {
          $activeComponent = 'GameLobby'
          $currentGame = response.data as Game
          console.log('Joined game: ', $currentGame)
          return
        }
        addAlert({
          color: 'red',
          message: response.message,
          title: 'Join error'
        })
      })
    }
  }

  function joinGameInProgress(data: { game: Game; player: Player; question: Question }) {
    if (data.game.currentRound === 0) {
      $activeComponent = 'GameLobby'
      $currentGame = data.game
      return
    }
    if (data.question) {
      selectQuestionType(data.question.type)
      $currentGame = data.game
      $currentQuestion = data.question
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

<CustomLabel>Lobby</CustomLabel>
<div>
  {#if !playerConnected}
    <div class="pt-8">
      <ButtonGroup class="w-full" size="lg">
        <Input id="name" type="text" placeholder="Player/team name" bind:value={name} />
        {#if !loading}
          <Button color="primary" on:click={() => connectPlayer()} disabled={!name || !song}
            >Join</Button
          >
        {/if}
        {#if loading}
          <Button disabled>
            <Spinner class="me-3" size="4" color="white" />Loading
          </Button>
        {/if}
      </ButtonGroup>
      <Select class="mt-2" items={$availableSongs} bind:value={song} placeholder="Select song" />
    </div>
  {/if}

  {#if playerConnected}
    <div class="p-4">
      <!-- Header -->
      <h1 class="text-2xl font-bold text-center text-white mb-4">Available Games</h1>

      {#if games.length > 0}
        <!-- Game List -->
        <ul class="space-y-3">
          {#each games as game, index}
            <li
              class="p-4 bg-white shadow-md rounded-lg border border-gray-200 flex flex-col space-y-2"
            >
              <!-- Game Name -->
              <h2 class="text-2xl font-semibold text-gray-800">{game.name}</h2>

              <!-- Game Details -->
              <div class="text-lg text-gray-600">
                <p><span class="font-medium">Rounds:</span> {game.rounds}</p>
                <p><span class="font-medium">Players:</span> {game.players} connected</p>
                <p>
                  <span class="font-medium">Created:</span>
                  <Time
                    relative
                    live
                    format="dddd @ h:mm A · MMMM D, YYYY"
                    timestamp={game.createdAt}
                  />
                </p>
              </div>

              <!-- Join Button -->
              <div class="mt-2">
                <ButtonGroup class="w-full" size="md">
                  <Input id="name" type="text" placeholder="Enter code" bind:value={codes[index]} />
                  <Button color="primary" on:click={() => joinGame(game.id, index)}
                    >Join Game</Button
                  >
                </ButtonGroup>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p>No games available</p>
        <p>Wait for host to create a game</p>
        <Spinner />
      {/if}
    </div>
  {/if}
</div>
