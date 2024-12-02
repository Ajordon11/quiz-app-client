<script lang="ts">
  import { Button, ButtonGroup, Input, Label } from "flowbite-svelte";
  import { addAlert, clearAlerts, player, socket } from "../lib/stores/index ";
  import type { Player, SocketResponse } from "../lib/models";

  let playerConnected: boolean = false;
  let gameJoined: boolean = false;
  let name: string;

  function connectPlayer() {
    clearAlerts();
    $socket.emit("player-create", { name }, (response: SocketResponse) => {
      console.log("Response from server on player create: ", response);
      if (response.success) {
        playerConnected = true;
        $player = response.data as Player;
      } else {
          addAlert({
            color: "red",
            message: response.message,
            title: "Login error",
          });
      }
    });
  }
</script>

<div>
  {#if !playerConnected}
    <div class="pt-8">
      <ButtonGroup class="w-full" size="lg">
        <Input
          id="name"
          type="text"
          placeholder="Player/team name"
          bind:value={name}
        />
        <Button color="primary" on:click={() => connectPlayer()}>Create</Button>
      </ButtonGroup>
    </div>
  {/if}

  {#if playerConnected && !gameJoined}
    <div class="pt-8">
      <ButtonGroup class="w-full" size="lg">
        <Input id="name" type="text" placeholder="Game name" />
        <Button color="primary">Enter</Button>
      </ButtonGroup>
    </div>
  {/if}

  {#if gameJoined}
    <div class="pt-8">
      <ButtonGroup class="w-full" size="lg">
        <Input id="name" type="text" placeholder="Player/team name" />
        <Button color="primary">Create</Button>
      </ButtonGroup>
    </div>
  {/if}
</div>
