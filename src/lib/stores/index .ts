import { io, type Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { Player } from "../models";

const url = import.meta.env.PROD
? import.meta.env.VITE_PROD_SERVER_URL
: import.meta.env.VITE_DEV_SERVER_URL;
export const URL = writable(url);
export const activeComponent = writable("ConnectPage");
export const activeComponentLabel = writable("Connect");
export const socket = writable<Socket>(io(url));

export const player = writable<Player>();
