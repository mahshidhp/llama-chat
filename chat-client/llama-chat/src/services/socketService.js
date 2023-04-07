import { io } from 'socket.io-client'
import config from '../config.json'
import authService from './authService'

const url = config.apiUrl
const socket = io(url, { autoConnect: false })

export function run(
  onMsgSent,
  onMsgReceive,
  onLastSeenReceive,
  getContactsUsernames,
) {
  socket.connect()

  socket.on('connect', () => {
    socket.emit('connected', { username: authService.getCurrentUser() })
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
    socket.emit('heartbeat', { username: authService.getCurrentUser() })
  }, 10000)

  setInterval(() => {
    const contactsUsernames = getContactsUsernames()
    socket.emit('last_seen', { contacts: contactsUsernames })
  }, 10000)
}

export function send(text, to) {
  const msg = {
    from: authService.getCurrentUser(),
    to: to,
    text: text,
    createdAt: new Date().getTime(),
    status: 'unsent',
  }
  socket.emit('msg', msg)
  return msg
}

const socketService = {
  run,
  send,
}

export default socketService
