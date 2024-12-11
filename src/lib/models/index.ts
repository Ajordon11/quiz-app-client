export type SocketResponse = {
  success: boolean
  message: string
  data: object
}

export type Player = {
  id: string
  name: string
  ready: boolean
}

export type AlertProps = {
  message: string
  title: string
  id?: number
  color?: any
  timeout?: number
  dismissable?: boolean
}

export type Game = {
  id: string
  name: string
  status: string
  rounds: number
  questionSet: string
  createdAt: Date
  players: number
  currentRound: number
}

export type Question = {
  question: string
  type: string
  options: string[]
}
