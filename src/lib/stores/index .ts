import { io, type Socket } from 'socket.io-client'
import { writable } from 'svelte/store'
import type { Game, Player, Question } from '../models'

const url = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_SERVER_URL
  : import.meta.env.VITE_DEV_SERVER_URL
export const URL = writable(url)
// export const activeComponent = writable("ConnectPage");
export const activeComponent = writable('QuestionLetter')

export const socket = writable<Socket>(io(url))

export const player = writable<Player>()

export const currentGame = writable<Game>({
  id: '12345',
  name: 'Test Game',
  status: 'IN_PROGRESS',
  rounds: 4,
  questionSet: 'data',
  createdAt: new Date(),
  players: 2,
  currentRound: 2
})
export const currentQuestion = writable<Question>({
  question: 'Order the following words in alphabetical order.',
  type: 'LETTER',
  options: ['A', 'C', 'D', 'B']
})

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
