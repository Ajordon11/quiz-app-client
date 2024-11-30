import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
})

const URL = import.meta.env.REMOTE_SERVER
// const URL = 'http://localhost:3000';

export const socket: ReturnType<typeof io> = io(URL, {
  withCredentials: true,
})

socket.on('connect', () => {
  console.log('connected...')
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
