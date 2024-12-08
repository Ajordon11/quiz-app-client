<script lang="ts">
  import { activeComponent, activeComponentLabel, currentGame, currentQuestion, socket } from "./lib/stores/index ";
  import ConnectPage from "./components/ConnectPage.svelte";
  import Lobby from "./components/Lobby.svelte";
  import { BookOpenSolid } from "flowbite-svelte-icons";
  import Alerts from "./components/Alerts.svelte";
  import { Spinner } from "flowbite-svelte";
  import QuestionMultipleChoice from "./components/QuestionMultipleChoice.svelte";
  import type { Question } from "./lib/models";
  import QuestionOrder from "./components/QuestionOrder.svelte";
  import QuestionLetter from "./components/QuestionLetter.svelte";

  let correctAnswer = $state();

  $socket.on("server-info", (data) => {
    console.log(data);
    $socket.emit("message", "Hello");
  });
  $socket.on("game-started", (data) => {
    console.log("Game is starting: ", data);
    selectQuestionType(data.type);
    $currentGame.currentRound = 1;
    $currentQuestion = data;
  });

  $socket.on("next-question", (data: Question) => {
    console.log("Next question: ", data);
    selectQuestionType(data.type);
    // $currentGame.currentRound++;
    $currentQuestion = data;
  });

  $socket.on("countown", () => {
    console.log("Countdown");
    setTimeout(() => {
      console.log("Countdown finished");
    }, 5000);
  });

  $socket.on("correct-answer", (data) => {
    console.log("Received answer: ", data);
    correctAnswer = data;
  });

  function sendAnswer(answer: string) {
    $socket.emit("answer", { answer, gameId: $currentGame.id });
  }

  // todo: send answers from components, get correct answer from server, show score

  function selectQuestionType(type: string) {
    switch (type) {
      case "MULTIPLE_CHOICE":
        $activeComponent = "QuestionMultipleChoice";
        break;
      case "LETTER":
        $activeComponent = "QuestionLetter";
        break;
      case "ORDER":
        $activeComponent = "QuestionOrder";
        break;
      case "NUMBER":
        $activeComponent = "QuestionNumber";
        break;
    }
  }
</script>

<main class="dark">
  <div class="flex flex-col items-center justify-center overflow-hidden max-h-screen">
    <div class="top-0">
      <div>
        <BookOpenSolid color="white" size="xl" class="inline-block m-2 mb-5" />
        <h1 class="text-4xl font-bold text-white inline-block">
          {$activeComponentLabel}
        </h1>
      </div>
    </div>
    <Alerts />
    {#if $activeComponent === "ConnectPage"}
      <ConnectPage />
    {/if}
    {#if $activeComponent === "Lobby"}
      <Lobby />
    {/if}
    {#if $activeComponent === "GameLobby"}
      <p>Game is not started</p>
      <p>Wait for host to start the game</p>
      <Spinner />
    {/if}
    {#if $activeComponent === "QuestionMultipleChoice"}
      <QuestionMultipleChoice question={$currentQuestion} {sendAnswer} {correctAnswer} />
    {/if}
    {#if $activeComponent === "QuestionLetter"}
        <QuestionLetter question={$currentQuestion} {sendAnswer} {correctAnswer} />
        {/if}
    {#if $activeComponent === "QuestionOrder"}
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
