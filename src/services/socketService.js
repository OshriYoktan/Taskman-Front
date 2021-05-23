import io from 'socket.io-client'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService

function createSocketService() {
    var socket
    const socketService = {
        setup() {
            socket = io(baseUrl)
        },
        on(eventName, cb) {
            if (!socket) socketService.setup();
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) socketService.setup();
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            if (!socket) socketService.setup();
            socket.emit(eventName, data)
        },
        terminate() {
            socket = null
        }
    }
    return socketService
}