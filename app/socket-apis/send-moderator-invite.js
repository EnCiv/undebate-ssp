// https://github.com/EnCiv/undebate-ssp/issues/74
import { Iota } from 'civil-server'
import SibGetTemplateId, { SibSendTranscEmail } from '../lib/send-in-blue-transactional'
import getElectionStatusMethods from '../lib/get-election-status-methods'

const templateId = SibGetTemplateId('moderator-invitation')
if (!templateId) logger.error('send-moderator-invite template not found')

export default async function sendModeratorInvite(id, cb) {
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        cb && cb()
        return
    }
    const iota = await Iota.findOne({ _id: Iota.ObjectId(id) })
    if (!iota) {
        logger.error('sendModeratorInvite id not found', id)
        return cb()
    }
    const electionObj = getElectionStatusMethods(undefined, iota.webComponent)
    if (!electionObj.isModeratorReadyToInvite()) {
        logger.error('sendModeratorInvite moderator is not ready to invite', moderator)
        return cb()
    }
    const submissionDeadline = electionObj.getLatestObj(electionObj.timeline.moderatorSubmissionDeadline).date
    const params = {
        name: electionObj.name,
        email: electionObj.email,
        organizationName: electionObj.organizationName,
        organizationLogo: electionObj.organizationLogo,
        moderator: {
            ...electionObj.moderator,
            recorder_url: process.env.HOSTNAME + electionObj.getLatestIota(electionObj.moderator.recorders).path,
            submissionDeadline: new Date(submissionDeadline).toLocaleString(),
        },
    }
    SibSendTranscEmail(
        { params, to: params.moderator.email, templateId, tags: [`id:${id}`, 'role:moderator'] },
        data => {
            if (data) console.info(data)
            else logger.error('sendModeratorInvite failed')
        }
    )
}
