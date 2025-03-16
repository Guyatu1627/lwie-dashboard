import { io, type Socket } from "socket.io-client"
import { auth } from "./auth"

let socket: Socket | null = null

export const socketClient = {
  /**
   * Connect to the socket server
   * @returns Socket instance
   */
  connect(): Socket {
    if (socket) return socket

    const token = auth.getAccessToken()

    if (!token) {
      throw new Error("Authentication required to connect to socket")
    }

    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
      auth: {
        token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on("connect", () => {
      console.log("Socket connected")
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
    })

    return socket
  },

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  },

  /**
   * Get the socket instance
   * @returns Socket instance or null if not connected
   */
  getSocket(): Socket | null {
    return socket
  },

  /**
   * Subscribe to an event
   * @param event - Event name
   * @param callback - Event callback
   */
  on<T>(event: string, callback: (data: T) => void): void {
    if (!socket) {
      this.connect()
    }

    socket?.on(event, callback)
  },

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param callback - Event callback
   */
  off<T>(event: string, callback?: (data: T) => void): void {
    if (socket) {
      if (callback) {
        socket.off(event, callback)
      } else {
        socket.off(event)
      }
    }
  },

  /**
   * Emit an event
   * @param event - Event name
   * @param data - Event data
   */
  emit<T>(event: string, data: T): void {
    if (!socket) {
      this.connect()
    }

    socket?.emit(event, data)
  },
}

