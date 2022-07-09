// https://github.com/EnCiv/undebate-ssp/issues/127

import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'
import candidateViewerRecorder from '../components/lib/candidate-viewer-recorder'
import { getElectionDocById } from './get-election-docs'
import { getLatestIota } from '../lib/get-election-status-methods'

// todo eventually replace this video
const introVideo =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4'

const viewer = {
    webComponent: 'CandidateConversation',
    logo: 'undebate',
    instructionLink: '',
    closing: {
        thanks: 'Thank You.',
        iframe: {
            src: 'https://docs.google.com/forms/d/e/1FAIpQLSdDJIcMltkYr5_KRTS9q1-eQd3g79n0yym9yCmTkKpR61uPLA/viewform?embedded=true',
            width: '640',
            height: '4900',
        },
    },
    shuffle: true,
    participants: {
        moderator: {
            speaking: [
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154168/604549e51d2e1a001789b536-0-speaking20210307T215547934Z.mp4',
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154169/604549e51d2e1a001789b536-1-speaking20210307T215608159Z.mp4',
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154173/604549e51d2e1a001789b536-2-speaking20210307T215609530Z.mp4',
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154178/604549e51d2e1a001789b536-3-speaking20210307T215613030Z.mp4',
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154181/604549e51d2e1a001789b536-4-speaking20210307T215618429Z.mp4',
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154185/604549e51d2e1a001789b536-5-speaking20210307T215621703Z.mp4',
            ],
            name: 'Thad (Boston + NAC)',
            listening:
                'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1615154190/604549e51d2e1a001789b536-0-listening20210307T215625550Z.mp4',
            agenda: [
                [
                    'Introductions',
                    '1- Name',
                    '2- City and State',
                    '3- One word to describe yourself',
                    '4- What role are you running for?',
                ],
                ['How did you get started with your brigade?'],
                [
                    'A prospective volunteer comes to you and asks "what can I do as part of the CfA Brigade Network that I can’t accomplish anywhere else?" How would you answer?',
                ],
                [
                    'Brigades of all sizes struggle with attracting and retaining volunteers, but this is especially draining for small brigades in less populous communities. What ideas do you have for supporting participation in situations where the Brigade model is not thriving?',
                ],
                [
                    'What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?',
                ],
                ['Thank you!'],
            ],
            timeLimits: [15, 60, 60, 60, 60],
        },
    },
}

export default async function createCandidateRecorder(id, userId, cb) {
    logger.debug('createCandidateRecorder called')
    if (!this.synuser) {
        logger.error('createCandidateRecorder called, but no user ', this.synuser)
        if (cb) cb() // no user
        return
    }
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        logger.error('createCandidateRecorder called, but bad id:', id)
        if (cb) cb() // no user
        return
    }
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        logger.error('createCandidateRecorder called, but bad userId:', userId)
        if (cb) cb() // no user
        return
    }
    try {
        getElectionDocById.call(this, id, async iota => {
            if (!iota) {
                logger.error('createCandidateRecorder called, but no iota found by id:', id)
                if (cb) cb()
                return
            }
            logger.debug('iota', iota)
            const electionObj = iota.webComponent
            let msgs
            if ((msgs = reasonsNotReadyForCandidateRecorder(electionObj)).length) {
                logger.error('not ready for candidate recorder:', msgs)
                if (cb) cb()
                return
            }
            const sortedQuestionPairs = Object.entries(electionObj.questions).sort(
                ([aKey, aObj], [bKey, bObj]) => aKey - bKey
            )
            const agenda = sortedQuestionPairs.map(([key, obj]) => [obj.text])

            const timeLimits = sortedQuestionPairs.map(([key, obj]) => [obj.time])

            const candidate = electionObj.candidates[userId]
            if (!candidate) {
                logger.error('no candidate found for userId:', userId)
                if (cb) cb()
                return
            }
            logger.debug('agenda', agenda)
            logger.debug('timeLimits', timeLimits)
            logger.debug('candidate', candidate)

            const moderatorComponent = getLatestIota(electionObj.moderator.submissions).component
            const speaking = moderatorComponent.participant.speaking.slice()
            speaking.unshift(introVideo)

            candidateViewerRecorder.candidateRecorder.component.participants.moderator.speaking = speaking
            candidateViewerRecorder.candidateRecorder.component.participants.moderator.listening =
                moderatorComponent.participant.listening

            candidateViewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking
            candidateViewerRecorder.candidateViewer.webComponent.participants.moderator.name =
                electionObj.moderator.name
            candidateViewerRecorder.candidateViewer.parentId = id

            const inRowObjs = Object.values(electionObj.candidates).map(candidate => {
                return {
                    Seat: candidate.office,
                    Name: candidate.name,
                    Email: candidate.email,
                    unique_id: candidate.uniqueId,
                }
            })
            logger.debug('inRowObjs passed in:', inRowObjs)
            const { rowObjs, messages } = await undebatesFromTemplateAndRows(candidateViewerRecorder, inRowObjs)
            logger.debug('rowObjs', rowObjs)
            logger.debug('messages', messages)
            if (!rowObjs) {
                if (cb) cb()
                return
            }
            if (cb) cb({ rowObjs, messages })
        })
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}

function reasonsNotReadyForCandidateRecorder(electionObj) {
    // todo add moderator.submissions not ready
    const errorMsgs = []

    ;['electionName', 'electionDate', 'organizationName', 'questions', 'script', 'moderator'].forEach(prop => {
        if (!electionObj[prop]) errorMsgs.push(`${prop} required`)
    })
    const { script = {}, questions = {} } = electionObj
    const sLength = Object.keys(script || {}).length // it could be null
    const qLength = Object.keys(questions || {}).length // it cold be null
    if (qLength + 1 !== sLength) {
        errorMsgs.push(`length of script ${sLength} was not one more than length of questions ${qLength}.`)
    }
    ;['name', 'email', 'message'].forEach(prop => {
        // todo change this to specific candidate
        if (!(electionObj.moderator || {})[prop]) errorMsgs.push(`candidate ${prop} required`)
    })
    return errorMsgs
}
