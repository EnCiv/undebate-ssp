// https://github.com/EnCiv/undebate-ssp/issues/74
import { serverEvents, Iota } from 'civil-server'
import { merge } from 'lodash'
import { subscribeEventName } from '../components/lib/socket-api-subscribe'
import {
    getElectionDocById,
    intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs,
    idsFromElectionObj,
} from './get-election-docs'
import { diff, detailedDiff } from 'deep-object-diff'
import { Socket } from 'socket.io'

// there could be multiple subscribers to changes on the same id.  When a change is made to an id, be careful to only update the electionIota once, and then send the update to all the subscribers.
// currently, updates are the entire iota, in the ideal, only what's changed will be send in the update.

const electionIotaSubscribers = {}

function onSocketDisconnect(socket, id) {
    socket.on('disconnect', () => {
        removeSocket(socket, id)
    })
}

export function removeSocket(socket, id) {
    const i = electionIotaSubscribers[id]?.sockets?.findIndex(s => s === socket) || -1
    if (i < 0) {
        // this happens when the server restarts with browsers still open,
        // the browers will try to unsubscribe from sockets that don't exist anymore
        return
    }
    electionIotaSubscribers[id].sockets.splice(i, 1)
    if (electionIotaSubscribers[id].sockets.length === 0) {
        delete electionIotaSubscribers[id]
    }
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
            const electionIotaSubscriber = Object.values(electionIotaSubscribers).find(({ childIds }) =>
                childIds.find(id => iota.parentId === id)
            ) // this could be optimized so that childIds is an object with childId as the key, and electionIotaId as the parent.
            if (!electionIotaSubscriber?.electionIota) {
                logger.warn('subscribeElectionInfo ParticipantCreate event, no parent found for', iota)
                return
            }
            updateElectionInfo(
                // no this because subscrbers change over time, but this wont
                Iota.ObjectID(electionIotaSubscriber.electionIota._id).toString(),
                iota.parentId,
                [iota]
            )
            electionIotaSubscriber.childIds = idsFromElectionObj(electionIotaSubscriber.electionIota) // this could be optimized to push iota._id if it was the 'right' type of iota
        })
        serverEventsSubscribed = true
    }
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        cb && cb()
        return
    }
    const socket = this
    getElectionDocById.call(this, id, electionIota => {
        if (!electionIota) {
            logger.error('subscribeElectionInfo: id not found:', id)
            cb & cb()
            return
        }
        if (!electionIotaSubscribers[id])
            // checking in callback because things could have changed
            electionIotaSubscribers[id] = { electionIota, sockets: [], childIds: idsFromElectionObj(electionIota) }
        else {
            if (!electionIotaSubscribers[id].sockets.length) {
                electionIotaSubscribers[id].electionIota = electionIota
                electionIotaSubscribers[id].childIds = idsFromElectionObj(electionIota)
            } else {
                const { added, deleted, updated } = detailedDiff(electionIotaSubscribers[id].electionIota, electionIota)
                merge(added, updated)
                unundefine(deleted)
                if (added.webComponent || deleted.webComponent) {
                    // there has been changes in the db that hasn't been sent to the subscribes yet - example undebates-from-templates-and-rows makes changes without sending notifications
                    // to do - .watch() the iota collection for updates
                    updateSubscribers.call(this, id, added, deleted)
                }
            }
        }
        finishSubscribe(socket, id, cb)
    })
}
// for every value in the obj that is undefined set it to ''
function unundefine(obj) {
    if (!obj) return
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') unundefine(obj[key])
        else if (typeof obj[key] === 'undefined') obj[key] = ''
    })
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
        logger.warn('subscribeElectionInfo expected subscibers of', rootId, 'to have . deleting the object')
        delete electionIotaSubscribers[rootId]
        return
    }
    const socket = this instanceof Socket ? this : sockets[0] // if called from a socket, use that otherwise only need the first one, broadcast will send to all the rest
    const update = {}
    intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(update, electionIota, parentId, iotas, [])
    const eventName = subscribeEventName('subscribe-election-info', rootId)
    merge(electionIota, update)
    electionIotaSubscribers[rootId].childIds = idsFromElectionObj(electionIota) // update childIds because we don't have async events in all cases
    const electionUpdates = update.webComponent || {}
    socket.broadcast.to(rootId).emit(eventName, electionUpdates)
    socket.emit(eventName, electionUpdates) // broadcast above doesn't send it to the socket itself
}

function applyUnset(obj, unset = {}) {
    Object.keys(unset).forEach(key => {
        if (typeof unset[key] === 'object') {
            if (typeof obj[key] === 'object') applyUnset(obj[key], unset[key])
            else return // no need to unset something that's not there
        } else delete obj[key]
    })
}

export function updateSubscribers(rootId, update, unset) {
    if (!rootId) {
        logger.warn('updateSubscribers - no parentId')
        return
    }
    if (!electionIotaSubscribers[rootId]) {
        logger.warn('updateSubscribers - electionObjSubscriber of', rootId, 'not found')
        return
    }
    const { electionIota, sockets } = electionIotaSubscribers[rootId]
    if (sockets.length === 0) {
        logger.warn('updateSubscribers expected subscibers of', rootId, 'to have . deleting the object')
        delete electionIotaSubscribers[rootId]
        return
    }
    const eventName = subscribeEventName('subscribe-election-info', rootId)
    update && merge(electionIota, update)
    unset && applyUnset(electionIota, unset)
    this.broadcast.to(rootId).emit(eventName, update?.webComponent, unset?.webComponent)
}
