// https://github.com/EnCiv/undebate-ssp/issues/74
import { SibGetTemplateId, SibSendTransacEmail } from '../lib/send-in-blue-transactional'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import { getElectionDocById } from './get-election-docs'
import { Iota } from 'civil-server'
import { updateElectionInfo } from './subscribe-election-info'

var templateId

export default async function sendModeratorInvite(id, cb) {
    const userId = this.synuser && this.synuser.id
    if (!userId) {
        cb && cb()
        return
    }
    if (!templateId) {
        templateId = await SibGetTemplateId('moderator-invitation')
        if (!templateId) {
            logger.error('send-moderator-invite template not found')
            cb && cb()
            return
        }
    }
    getElectionDocById.call(this, id, async iota => {
        if (!iota) {
            logger.error('sendModeratorInvite id not found', id)
            cb && cb()
            return
        }
        const electionObj = iota.webComponent
        const electionMethods = getElectionStatusMethods(undefined, electionObj)
        if (!electionMethods.isModeratorReadyToInvite()) {
            logger.error('sendModeratorInvite moderator is not ready to invite', electionObj.moderator)
            cb && cb()
            return
        }
        const submissionDeadline = electionMethods.getLatestObj(electionObj.timeline.moderatorSubmissionDeadline).date
        const params = {
            name: electionObj.name,
            email: electionObj.email,
            organizationName: electionObj.organizationName,
            organizationLogo: electionObj.organizationLogo,
            moderator: {
                name: electionObj.moderator.name,
                email: electionObj.moderator.email,
                recorder_url:
                    process.env.HOSTNAME + electionMethods.getLatestIota(electionObj.moderator.recorders).path,
                submissionDeadline: new Date(submissionDeadline).toLocaleString(),
            },
        }
        const messageProps = {
            params,
            to: [{ email: params.moderator.email, name: params.moderator.name }],
            templateId,
            tags: [`id:${id}`, 'role:moderator'],
        }
        const result = await SibSendTransacEmail(messageProps)
        if (!result || !result.messageId) logger.error('sendModeratorInvite failed', id)
        else {
            try {
                const doc = await Iota.create({
                    parentId: id,
                    subject: 'Moderator Invite Sent',
                    description: `Moderator Invite Send for election ${electionObj?.electionName || id}`,
                    component: {
                        component: 'ModeratorEmailSent',
                        messageId: result.messageId,
                        ...messageProps,
                        sentDate: new Date().toISOString(),
                    },
                })
                updateElectionInfo(id, id, [doc])
            } catch (error) {
                logger.error("send-moderator-invite couldn't create Iota for ModeratorEmailSent", error)
            }
        }
        cb && cb(result.messageId)
    })
}
