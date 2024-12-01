<script lang="ts">
  import { io } from "socket.io-client";

  let connected: string = "Nope!";

  const socket = io("https://quiz-app-server-xatw.onrender.com");

  socket.on("connect", () => {
    connected = "We got a signal!";
  });

  socket.on("server-info", (data) => {
    console.log(data);
    socket.emit("message", "Hello");
  });
</script>

<main>
  <h1>{connected}</h1>
</main>

<style>
</style>
