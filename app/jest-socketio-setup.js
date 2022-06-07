// setup socket.io server
const SocketIoPort = await getPort() // not static port# because there may be multiple tests in parallel
const server = socketIo()
let connections = 0
server.on('connection', socket => {
    connections++
    // synuser info is used by APIs
    socket.synuser = { id: User.ObjectID(user._id).toString() }
    socket.on(handle, socketApiUnderTest.bind(socket)) // this is what we are testing
    socket.on('disconnect', reason => {
        if (--connections <= 0) server.close() // so test will finish
    })
})
server.listen(SocketIoPort)

// start socket.io client connection to server
window.socket = clientIo.connect(`http://localhost:${SocketIoPort}`)
await new Promise((ok, ko) => {
    window.socket.on('connect', () => {
        ok()
    })
})
