import createCandidateRecorders from './create-candidate-recorders'
import sendCandidateInvites from './send-candidate-invites'

// do both on the sever

export default function createSendCandidateInvites(id, filter, cb) {
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        logger.error('createSendCandidateInvites user not logged in', userId)
        cb && cb()
        return
    }
    createCandidateRecorders.call(this, id, filter, result => {
        if (!result) {
            cb && cb()
            return
        }
        const { rowObjs, messages } = result
        sendCandidateInvites.call(this, id, 'ALL', sentMessages => {
            if (!sentMessages) {
                cb && cb()
                return
            }
            cb && cb({ rowObjs, messages, sentMessages })
        })
    })
}
