// https://github.com/EnCiv/undebate-ssp/issues/74
import { serverEvents, Iota } from 'civil-server'
import { subscribeEventName } from '../components/lib/socket-api-subscribe'

export default function subscribeElectionInfo(id, cb) {
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        cb()
        return
    }
    async function subscribeIt(socket) {
        const electionObj = await Iota.findOne({ _id: Iota.ObjectId(id) })
        socket.join(id) // join this user into the socket.io room related to this item
        function electionInfoUpdate(iota) {
            console.info('electionInfoUpdate', iota)
            if (iota.parentId !== id) return console.info("didn't match parentId")
            if (!electionObj.participants) electionObj.participants = []
            electionObj.participants.unshift(iota)
            const event = subscribeEventName('subscribe-election-info', id)
            socket.broadcast.to(id).emit(event, { participants: electionObj.participants })
            socket.emit(event, { participants: electionObj.participants })
        }
        cb(electionObj)
        serverEvents.on(serverEvents.eNames.ParticipantCreated, electionInfoUpdate)
        socket.on('disconnect', () =>
            serverEvents.removeListener(serverEvents.eNames.ParticipantCreated, electionInfoUpdate)
        )
    }
    // 'this' is a socket belonging to the API caller
    subscribeIt(this)
}
