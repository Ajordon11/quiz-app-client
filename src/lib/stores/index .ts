import { io, type Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { AlertProps, Player } from "../models";

export const activeComponent = writable("ConnectPage");
export const activeComponentLabel = writable("Connect");
// export const socket = writable<Socket>(io("https://quiz-app-server-xatw.onrender.com"));
export const socket = writable<Socket>(io("http://localhost:3000"));

export const player = writable<Player>();

export const alerts = writable<AlertProps[]>([]);
export const addAlert = (alert: AlertProps) => {
  const id = Math.floor(Math.random() * 10000);
  const defaults = {
    id,
    color: "secondary",
    dismissable: true,
    timeout: 3000,
  };
  alerts.update((all) => [{ ...defaults, ...alert }, ...all]);
  return id;
};
export const dismissAlert = (id: number) => {
  alerts.update((all) => all.filter((t) => t.id !== id));
};

export const clearAlerts = () => {
  alerts.set([]);
};