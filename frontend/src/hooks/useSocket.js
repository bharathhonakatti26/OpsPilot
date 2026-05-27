import { useEffect, useMemo } from 'react'
import { createSocket } from '../sockets/socket.js'
import { useAuth } from './useAuth.js'

export const useSocket = () => {
  const { accessToken } = useAuth()
  const socket = useMemo(() => createSocket(accessToken), [accessToken])

  useEffect(() => {
    if (!accessToken) return
    socket.connect()
    return () => socket.disconnect()
  }, [socket, accessToken])

  return socket
}
