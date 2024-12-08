<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Input,
    Label,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    type SelectOptionType,
  } from "flowbite-svelte";
  import { activeComponent, currentGame, player, socket, URL } from "../lib/stores/index ";
  import type { Game, Player, SocketResponse } from "../lib/models";
  import { addAlert, clearAlerts } from "../lib/stores/alerts";
  import { onMount } from "svelte";
  import Time from "svelte-time";
  import CustomLabel from "./shared/CustomLabel.svelte";

  onMount(() => {
    getAvailableGames();
  });

  let playerConnected: boolean = false;
  let name: string;
  let loading: boolean = false;
  let games: Game[] = [];
  let gamesAsOptions: SelectOptionType<any>[] = [];
  let selectedGameId: string;
  let gameSelected: Game;
  let password: string;

  function connectPlayer() {
    clearAlerts();
    loading = true;
    $socket.emit("player-create", { name }, (response: SocketResponse) => {
      console.log("Response from server on player create: ", response);
      if (response.success) {
        $player = response.data as Player;
        playerConnected = true;
      } else {
        addAlert({
          color: "red",
          message: response.message,
          title: "Login error",
        });
      }
    });
  }

  $socket.on("game-created", (data) => {
    console.log("New game created on server: ", data);
    getAvailableGames();
  });

  async function getAvailableGames() {
    const res = await fetch($URL + "/api/games/available");
    games = (await res.json()) as Game[];
    gamesAsOptions = games.map((game) => {
      return {
        name: game.name,
        value: game.id,
      };
    });
    console.log(games);
    loading = false;
  }

  function selectGame(game: Game) {
    selectedGameId = game.id;
    gameSelected = game;
  }

  function joinGame() {
    clearAlerts();
    if (selectedGameId && password) {
      $socket.emit(
        "game-join",
        { gameId: selectedGameId, password },
        (response: SocketResponse) => {
          if (response.success) {
            $activeComponent = "GameLobby";
            $currentGame = response.data as Game;
            console.log("Joined game: ", $currentGame);
            return;
        }
        addAlert({
          color: "red",
          message: response.message,
          title: "Join error",
        })
    })

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
          <Button color="primary" on:click={() => connectPlayer()}>Create</Button>
        {/if}
        {#if loading}
          <Button disabled>
            <Spinner class="me-3" size="4" color="white" />Loading
          </Button>
        {/if}
      </ButtonGroup>
    </div>
  {/if}

  {#if playerConnected && !gameSelected}
    <div class="pt-8">
      {#if games.length === 0}
        <p>No games available</p>
        <p>Wait for host to create a game</p>
        <Spinner />
      {/if}
      {#if games.length > 0}
        <h1 class="text-4xl font-bold mb-3">Available games</h1>
        <Table hoverable={true}>
          <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Rounds</TableHeadCell>
            <TableHeadCell>Players</TableHeadCell>
            <TableHeadCell>Created at</TableHeadCell>
            <TableHeadCell>
              <span class="sr-only">Join</span>
            </TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#each games as game}
              <TableBodyRow>
                <TableBodyCell>{game.name}</TableBodyCell>
                <TableBodyCell>{game.rounds}</TableBodyCell>
                <TableBodyCell>{game.players}</TableBodyCell>
                <TableBodyCell
                  ><Time
                    relative
                    live
                    format="dddd @ h:mm A · MMMM D, YYYY"
                    timestamp={game.createdAt}
                  /></TableBodyCell
                >
                <TableBodyCell>
                  <button
                    on:click={() => selectGame(game)}
                    class="pointer font-medium text-primary-600 hover:underline dark:text-primary-500">Join</button
                  >
                </TableBodyCell>
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      {/if}
    </div>
  {/if}

  {#if gameSelected}
    <div class="pt-8">
      <Label for="name" class="float-left mb-2">Enter password for game: {gameSelected.name}</Label>
      <ButtonGroup class="w-full" size="lg">
        <Input id="name" type="text" placeholder="Password" bind:value={password} />
        <Button color="primary" on:click={() => joinGame()}>Enter</Button>
      </ButtonGroup>
    </div>
  {/if}
</div>
