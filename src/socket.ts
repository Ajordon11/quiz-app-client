import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

const URL = process.env.NODE_ENV === "production" ? process.env.REMOTE_SERVER : "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log('connected...');
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});
