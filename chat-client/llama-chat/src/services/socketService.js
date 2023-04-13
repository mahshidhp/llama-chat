import { io } from 'socket.io-client'
import config from '../config.json'
import authService from './authService'

const url = config.apiUrl
const socket = io(url, {
  autoConnect: false,
  extraHeaders: {
    'x-auth-token': authService.getJwt(),
  },
})

export function run(
  onMsgSent,
  onMsgReceive,
  onLastSeenReceive,
  getContactsUsernames,
) {
  socket.connect()

  socket.on('connect', () => {
    socket.emit('connected')
  })

  socket.on('msg', (msg) => {
    onMsgReceive(msg)
  })

  socket.on('sent', (msg) => {
    onMsgSent(msg)
  })

  socket.on('last_seen', (data) => {
    onLastSeenReceive(data)
  })

  setInterval(() => {
    socket.emit('heartbeat')
  }, 10000)

  setInterval(() => {
    const contactsUsernames = getContactsUsernames()
    socket.emit('last_seen', {
      contacts: contactsUsernames,
    })
  }, 10000)
}

export function send(msg) {
  socket.emit('msg', msg)
}

const socketService = {
  run,
  send,
}

export default socketService
