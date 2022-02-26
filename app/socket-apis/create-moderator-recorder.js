// https://github.com/EnCiv/undebate-ssp/issues/106

import { Iota, undebatesFromTemplateAndRows } from 'civil-server'
import moderatorViewerRecorder from '../components/lib/moderator-viewer-recorder'

const introAndPlaceHolder =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4'
const timeForIntros =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-2-speaking20210304T213515529Z.mp4'
const firstQuestion =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4'
const superNextQuestion =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-4-speaking20210304T213517050Z.mp4'
const awesomeNowAnother =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4'
const splendidLastQuestion =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4'
const awesomeClosing =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4'
const allDone =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4'
const listening =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4'
const enCivModeratorName = 'David Fridley, EnCiv'

export default async function createModeratorRecorder(id, cb) {
    if (!this.synuser) {
        if (cb) cb() // no user
        console.info('no user')
        return
    }
    try {
        const electionObj = await Iota.findOne({ _id: Iota.ObjectId(id) })
        let msgs
        if ((msgs = reasonsNotReadyForModeratorRecorder(electionObj)).length) {
            if (cb) cb()
            console.info('msgs', msgs)
            return
        }
        const sortedQuestionPairs = Object.entries(electionObj.questions).sort(
            ([aKey, aObj], [bKey, bObj]) => aKey - bKey
        )
        const agenda = sortedQuestionPairs.map(([key, Obj]) => [Obj.text]).push('Make your closing - to the audience')
        const timeLimits = sortedQuetsionPars.map(([key, Obj]) => Obj.time)

        // the sequence of videos of the EnCiv moderator instucting the election moderator goes like this
        // always make the intro and instruct to record a placeholder
        const speaking = [introAndPlaceHolder]
        // then instruct to ask the first question
        if (agenda.length >= 1) speaking.push(firstQuestion)
        // then alternate between superNextQuestion and awesomeNowAnother until, but not including the last question
        let speakingCount = 1
        for (let speakingCount = 1; speakingCount < agenda.length - 1; speakingCount++)
            speaking.push(speakingCount.length % 2 ? superNextQuestion : awesomeNowAnother)
        // then instruct to ask the last question, but not if there was only one question
        if (speakingCount < agenda.length) speaking.push(splendidLastQuestion)
        // then instruct to make the closing
        speaking.push(awesomeClosing)
        // then instruct how to finish
        speaking.push(allDone)
        moderatorViewerRecorder.candidateRecorder.component.participants.moderator.name = enCivModeratorName
        moderatorViewerRecorder.candidateRecorder.component.participants.moderator.speaking = speaking
        moderatorViewerRecorder.candidateRecorder.component.participants.moderator.listening = listening

        const recorderAgenda = [['How this works', 'Placeholder']].concat(agenda).push(['Thank you'])
        const recorderTimeLimits = [15].concat(timeLimits.map((t, i) => 60)) // moderater gets 15 seconds for placeholder, 60 seconds to ask every question

        moderatorViewerRecorder.candidateRecorder.component.participants.moderator.agenda = recorderAgenda
        moderatorViewerRecorder.candidateRecorder.component.participants.moderator.timeLimits = recorderTimeLimits
        moderatorViewerRecorder.candidateRecorder.component.participants.human.name = electionObj.moderator.name

        moderatorViewerRecorder.candidateViewer.webComponent.participants.moderator.name = enCivModeratorName
        moderatorViewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking.slice(1, -1)
        moderatorViewerRecorder.candidateViewer.webComponent.participants.moderator.agenda = agenda
        moderatorViewerRecorder.candidateViewer.webComponent.participants.moderator.timeLimts = timeLimits
        moderatorViewerRecorder.candidateViewer.parentId = id

        const rowObjs = [{ Seat: 'Moderator', Name: electionObj.moderator.name, Email: electionObj.moderator.email }]
        const messages = await undebatesFromTemplateAndRows(moderatorViewerRecorder, rowObjs)

        if (messages.length) {
            console.info(messages)
            if (cb) cb()
        } else cb(rowObjs)
    } catch (err) {
        if (cb) cb()
        console.info('err', err)
    }
}

function reasonsNotReadyForModeratorRecorder(electionObj) {
    const errorMsgs = []

    ;[('electionName', 'electionDate', 'organizationName', 'questions', 'script', 'moderator')].forEach(prop => {
        if (!electionObj[prop]) errorMsgs.push(`${prop} required`)
    })
    if (errorMsgs.length) return errorMsgs
    const sLength = Object.keys(script || {}).length
    const qLength = Object.keys(questions || {}).length
    if (Object.keys(qLength + 1) !== Object.keys(sLength).length) {
        errorMsgs.push(`length of script ${sLength} was not one more than length of questions ${qLength}.`)
    }
    ;['name', 'email', 'message'].forEach(prop => {
        if (!(electionObj.moderator || {})[prop]) errorMsgs.push(`moderator ${prop} required`)
    })
    return []
}
