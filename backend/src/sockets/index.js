import { Server } from 'socket.io'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'
import { parseCommaList } from '../utils/parse.js'
import { SOCKET_EVENTS } from './events.js'
import { socketAuth } from './socketAuth.js'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: parseCommaList(env.SOCKET_CORS_ORIGIN),
      credentials: true,
    },
  })

  io.use(socketAuth)

  io.on('connection', (socket) => {
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`)
    }

    socket.on(SOCKET_EVENTS.WORKSPACE_JOIN, (workspaceId) => {
      if (workspaceId) socket.join(`workspace:${workspaceId}`)
    })

    socket.on(SOCKET_EVENTS.WORKSPACE_LEAVE, (workspaceId) => {
      if (workspaceId) socket.leave(`workspace:${workspaceId}`)
    })

    socket.on(SOCKET_EVENTS.PROJECT_JOIN, (projectId) => {
      if (projectId) socket.join(`project:${projectId}`)
    })

    socket.on(SOCKET_EVENTS.PROJECT_LEAVE, (projectId) => {
      if (projectId) socket.leave(`project:${projectId}`)
    })

    socket.on('disconnect', (reason) => {
      logger.info({ reason, socketId: socket.id }, 'Socket disconnected')
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}
