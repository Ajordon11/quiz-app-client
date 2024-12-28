import { io, type Socket } from 'socket.io-client'
import { writable } from 'svelte/store'
import type { Game, Player, Question } from '../models'
import type { SelectOptionType } from 'flowbite-svelte'

const url = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_SERVER_URL
  : import.meta.env.VITE_DEV_SERVER_URL
export const URL = writable(url)
export const activeComponent = writable('ConnectPage')
// export const activeComponent = writable('Scoreboard')

export const socket = writable<Socket>(io(url))

export const player = writable<Player>()
export const currentGame = writable<Game | null>()

export const currentQuestion = writable<Question | null>()
export const countdownTime = writable<number>(5)
export const availableSongs = writable<SelectOptionType<string>[]>([ {value: 'Blue da ba dei', name: 'Blue da ba dei'} ])

// Generate the alphabet dynamically
export const getAlphabet = (length: number = 26) =>
  Array.from({ length }, (_, i) => {
    const char = String.fromCharCode(65 + i)
    if (char === 'Q' || char === 'X') {
      return ''
    }
    if (char === 'V') {
      return 'Q V'
    }
    if (char === 'Z') {
      return 'X Z'
    }
    return char
  }).filter((char) => char !== '')
