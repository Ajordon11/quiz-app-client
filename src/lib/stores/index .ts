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
export const availableSongs = writable<SelectOptionType<string>[]>([
  { value: 'Da Ba Dee', name: 'Da Ba Dee' },
  { value: 'Rebel', name: 'Rebel' },
  { value: 'Rampa', name: 'Rampa' },
  { value: 'Dragostea Din Tei', name: 'Dragostea Din Tei' },
  { value: 'Gimme!', name: 'Gimme!' },
  { value: 'Song Groove', name: 'Song Groove' },
  { value: 'The 7th Element', name: 'The 7th Element' },
  { value: 'The Best', name: 'The Best' },
  { value: 'Red Sun In The Sky', name: 'Red Sun In The Sky' },
  { value: 'Rasputin', name: 'Rasputin' },
  { value: 'Aj tak sme stale frajeri', name: 'Aj tak sme stale frajeri' }
])

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
