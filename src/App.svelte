<script lang="ts">
  import {
    activeComponent,
    activeComponentLabel,
    socket,
  } from "./lib/stores/index ";
  import ConnectPage from "./components/ConnectPage.svelte";
  import Lobby from "./components/Lobby.svelte";
  import { BookOpenSolid } from "flowbite-svelte-icons";
  import Alerts from "./components/Alerts.svelte";

  $socket.on("server-info", (data) => {
    console.log(data);
    $socket.emit("message", "Hello");
  });
</script>

<main class="dark">
  <div class="flex flex-col items-center justify-center overflow-hidden max-h-screen">
    <div class="absolute top-5">
      <div>
        <BookOpenSolid color="white" size="xl" class="inline-block m-2 mb-5" />
        <h1 class="text-4xl font-bold text-white inline-block">
          {$activeComponentLabel}
        </h1>
      </div>
    </div>
    <Alerts/>
    {#if $activeComponent === "ConnectPage"}
      <ConnectPage />
    {/if}
    {#if $activeComponent === "Lobby"}
      <Lobby />
    {/if}
    {#if $activeComponent === "Game"}
      Hello in game
    {/if}
    <!-- {#if $activeComponent === "QuestionMultipleChoice"}
        <QuestionMultipleChoice {currentRound} question={currentQuestion} />
        {/if}
        {#if $activeComponent === "QuestionLetter"}
        <QuestionLetter {currentRound} question={currentQuestion} />
        {/if}
        {#if $activeComponent === "QuestionOrder"}
        <QuestionOrder {currentRound} question={currentQuestion} />
        {/if}
        {#if $activeComponent === "QuestionNumber"}
        <QuestionNumber {currentRound} question={currentQuestion} />
        {/if}
        {#if $activeComponent === "RoundResult"}
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
