// https://github.com/EnCiv/undebate-ssp/issues/106

import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'

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
    debugger
    if (!this.synuser) {
        logger.error('createModeratorRecorder called, but no user ', this.synuser)
        if (cb) cb() // no user
        return
    }
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        logger.error('createModeratorRecorder called, but bad id:', id)
        if (cb) cb() // no user
        return
    }
    try {
        const iota = await Iota.findOne({ _id: Iota.ObjectId(id) })
        if (!iota) {
            if (cb) cb()
            return
        }
        const electionObj = iota.webComponent
        let msgs
        if ((msgs = reasonsNotReadyForModeratorRecorder(electionObj)).length) {
            if (cb) cb()
            return
        }
        const sortedQuestionPairs = Object.entries(electionObj.questions).sort(
            ([aKey, aObj], [bKey, bObj]) => aKey - bKey
        )
        const agenda = sortedQuestionPairs.map(([key, Obj]) => [Obj.text])

        const timeLimits = sortedQuestionPairs.map(([key, Obj]) => Obj.time)

        // the sequence of videos of the EnCiv moderator instucting the election moderator goes like this
        // always make the intro and instruct to record a placeholder
        const speaking = [introAndPlaceHolder]
        // then instruct to ask the first question
        if (agenda.length >= 1) speaking.push(firstQuestion)
        // then alternate between superNextQuestion and awesomeNowAnother until, but not including the last question
        let speakingCount = 1
        for (; speakingCount < agenda.length - 1; speakingCount++)
            speaking.push(speakingCount.length % 2 ? superNextQuestion : awesomeNowAnother)
        // then instruct to ask the last question, but not if there was only one question
        if (speakingCount < agenda.length) speaking.push(splendidLastQuestion)
        // then instruct to make the closing
        speaking.push(awesomeClosing)
        // then instruct how to finish
        speaking.push(allDone)

        const viewerRecorder = new moderatorViewerRecorder()
        // customize viewerRecorder.gFC for this applicatin / data source
        const YYYY_MM_DD = electionObj.electionDate.split('T')[0].split('-')
        const electionDate = YYYY_MM_DD[1] + '/' + YYYY_MM_DD[2] + '/' + YYYY_MM_DD[0]
        viewerRecorder.gFC.election_date = row => electionDate
        // !!! type_id needs to be global unique we need the system to implement that
        const type_id = [...electionObj.organizationName].reduce(
            (type_id, c) => (c >= 'A' && c <= 'Z' ? type_id + c : type_id),
            ''
        )
        viewerRecorder.gFC.type_id = row => type_id
        viewerRecorder.gFC.election_source = row => electionObj.organizationName
        viewerRecorder.gFC.set.unique_id = (row, val) => (row['uniqueId'] = val)

        viewerRecorder.candidateRecorder.component.participants.moderator.name = enCivModeratorName
        viewerRecorder.candidateRecorder.component.participants.moderator.speaking = speaking
        viewerRecorder.candidateRecorder.component.participants.moderator.listening = listening

        agenda.unshift(['How this works', 'Placeholder'])
        agenda.push(['Make your closing - to the audience'])
        agenda.push(['Thank you'])

        const recorderTimeLimits = [15].concat(timeLimits.map((t, i) => 60)).concat(60) // moderater gets 15 seconds for placeholder, 60 seconds to ask every question and 60 seconds for the closing

        viewerRecorder.candidateRecorder.component.participants.moderator.agenda = agenda
        viewerRecorder.candidateRecorder.component.participants.moderator.timeLimits = recorderTimeLimits
        viewerRecorder.candidateRecorder.component.participants.human.name = electionObj.moderator.name

        viewerRecorder.candidateViewer.webComponent.participants.moderator.name = enCivModeratorName
        viewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking.slice(1)
        viewerRecorder.candidateViewer.webComponent.participants.moderator.listening = listening
        viewerRecorder.candidateViewer.webComponent.participants.moderator.agenda = agenda.slice(1)
        viewerRecorder.candidateViewer.webComponent.participants.moderator.timeLimits = timeLimits
        viewerRecorder.candidateViewer.parentId = id

        const inRowObjs = [{ Seat: 'Moderator', Name: electionObj.moderator.name, Email: electionObj.moderator.email }]
        const { rowObjs, messages } = await undebatesFromTemplateAndRows(viewerRecorder, inRowObjs)
        if (!rowObjs) {
            if (cb) cb()
            return
        }
        if (cb) cb({ rowObjs, messages })
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}

function reasonsNotReadyForModeratorRecorder(electionObj) {
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
        if (!(electionObj.moderator || {})[prop]) errorMsgs.push(`moderator ${prop} required`)
    })
    return errorMsgs
}
