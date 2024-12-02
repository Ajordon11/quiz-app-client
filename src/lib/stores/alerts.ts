import { writable } from "svelte/store";
import type { AlertProps } from "../models";

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