// https://github.com/EnCiv/undebate-ssp/issues/74
import { serverEvents, Iota } from 'civil-server'
import { merge } from 'lodash'
import { subscribeEventName } from '../components/lib/socket-api-subscribe'
import { getElectionDocById, intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs } from './get-election-docs'

// there could be multiple subscribers to changes on the same id.  When a change is made to an id, be careful to only update the electionIota once, and then send the update to all the subscribers.
// currently, updates are the entire iota, in the ideal, only what's changed will be send in the update.

const electionIotaSubscribers = {}

function onSocketDisconnect(socket, id) {
    socket.on('disconnect', () => {
        const i = electionIotaSubscribers[id].sockets.findIndex(s => s === socket)
        if (i < 0) {
            logger.error('could find socket', socket)
            return
        }
        electionIotaSubscribers[id].sockets.splice(i, 1)
        if (electionIotaSubscribers[id].sockets.length === 0) {
            delete electionIotaSubscribers[id]
        }
    })
}

function finishSubscribe(socket, id, cb) {
    electionIotaSubscribers[id].sockets.push(socket)
    socket.join(id) // join this user into the socket.io room related to this item
    onSocketDisconnect(socket, id)
    cb && cb(electionIotaSubscribers[id].electionIota.webComponent)
}

let serverEventsSubscribed = false
export default function subscribeElectionInfo(id, cb) {
    if (!serverEventsSubscribed) {
        serverEvents.on(serverEvents.eNames.ParticipantCreated, iota => {
            // The parent of the ParticipantCreate Iota is the viewer
            // we need to find if there is an electionIota with this viewer, and update that electionIota
            const electionIotaSubscriber = Object.values(electionIotaSubscribers).find(
                ({ electionIota }) => !!electionIota?.webComponent?.moderator?.viewers?.[iota.parentId]
            )
            if (!electionIotaSubscriber?.electionIota) {
                logger.warn('subscribeElectionInfo ParticipantCreate event, no parent found for', iota)
                return
            }
            updateElectionInfo(Iota.ObjectID(electionIotaSubscriber.electionIota._id).toString(), iota.parentId, [iota])
        })
        serverEventsSubscribed = true
    }
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        cb && cb()
        return
    }
    const socket = this
    if (electionIotaSubscribers[id]) finishSubscribe(socket, id, cb)
    else {
        getElectionDocById.call(this, id, electionIota => {
            if (!electionIota) {
                cb & cb()
                return
            }
            if (!electionIotaSubscribers[id])
                // checking in callback because things could have changed
                electionIotaSubscribers[id] = { electionIota, sockets: [] }
            finishSubscribe(socket, id, cb)
        })
    }
}

export function updateElectionInfo(rootId, parentId, iotas) {
    if (!rootId) {
        logger.warn('updateElectionInfo - no parentId')
        return
    }
    if (!electionIotaSubscribers[rootId]) {
        logger.warn('updateElectionInfo - electionObjSubscriber of', rootId, 'not found')
        return
    }
    const { electionIota, sockets } = electionIotaSubscribers[rootId]
    if (sockets.length === 0) {
        logger.warn('subscribeElectionInfo expected subscibers of', id, 'to have . deleting the object')
        delete electionIotaSubscribers[id]
    }
    const socket = sockets[0] // only need the first one, broadcast will send to all the rest
    const update = {}
    intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(update, electionIota, parentId, iotas, [])
    const eventName = subscribeEventName('subscribe-election-info', rootId)
    merge(electionIota, update)
    const electionUpdates = update.webComponent || {}
    socket.broadcast.to(rootId).emit(eventName, electionUpdates)
    socket.emit(eventName, electionUpdates) // broadcast above doesn't send it to the socket itself
}
