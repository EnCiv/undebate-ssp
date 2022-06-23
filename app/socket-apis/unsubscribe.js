import { removeSocket } from './subscribe-election-info'
export default function unsubscribe(eventName) {
    this.leave(eventName)
    const [name, id] = eventName.split(':')
    if (name === 'subscribe-election-info' && id) removeSocket(this, id)
}
