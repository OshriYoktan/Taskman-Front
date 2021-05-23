import io from 'socket.io-client'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService

function createSocketService() {
    var socket
    const socketService = {
        // socket is lazily created
        setup() {
            socket = io(baseUrl)
            console.log('using sockets!!!');
        },
        on(eventName, cb) {
            console.log('eventName back from back:', eventName)
            if (!socket) socketService.setup();
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) socketService.setup();
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            // console.log('eventName front to back:', eventName)
            if (!socket) socketService.setup();
            socket.emit(eventName, data)
        },
        terminate() {
            socket = null
        }
    }
    return socketService
}

// eslint-disable-next-line
function createDummySocketService() {
    var listenersMap = {}
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {}
        },
        terminate() {
            this.setup()
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName]) || [], cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },
        emit(eventName, data) {
            if (!listenersMap[eventName]) return
            listenersMap[eventName].forEach(listener => {
                listener(data)
            })
        },
        debugMsg() {
            this.emit('chat newMsg', { from: 'Someone', txt: 'Aha it worked!' })
        },
    }
    return socketService
}


// Basic Tests
// function cb(x) {console.log(x)}
// socketService.on('baba', cb)
// socketService.emit('baba', 'DATA')
// socketService.off('baba', cb)