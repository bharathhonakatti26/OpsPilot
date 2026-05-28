import { io } from 'socket.io-client'
import { env } from '../utils/env.js'

let socket

export const createSocket = (token) => {
  if (!socket) {
    const socketUrl = env.socketUrl.startsWith('http') ? env.socketUrl : window.location.origin

    socket = io(socketUrl, {
      autoConnect: false,
      auth: token ? { token } : {},
      transports: ['websocket'],
    })
  } else {
    socket.auth = token ? { token } : {}
  }

  return socket
}
