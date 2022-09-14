// https://github.com/EnCiv/undebate-ssp/issues/127
import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'
import sspViewerRecorder from '../lib/ssp-viewer-recorder'
import { getElectionDocById } from './get-election-docs'
import { getLatestIota, candidateFilters } from '../lib/get-election-status-methods'
import {updateElectionInfo} from "./subscribe-election-info";

// todo eventually replace this video
const introVideo =
    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4'

export default async function createCandidateRecorder(id, filter = 'ALL', cb) {
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
    try {
        getElectionDocById.call(this, id, async iota => {
            if (!iota) {
                logger.error('createCandidateRecorder called, but no iota found by id:', id)
                if (cb) cb()
                return
            }
            const electionObj = iota.webComponent
            const { rowObjs, messages } = await createCandidateRecordersFromIdAndElectionObj(id, filter, electionObj)
            if (!rowObjs) {
                if (cb) cb()
                return
            }

            logger.debug('messages', messages);
            logger.debug('rowObjs', rowObjs);
            logger.debug('hostname', process.env.HOST_NAME);
            for (const rowObj of rowObjs) {
                const paths = []
                if (rowObj.viewer_url) paths.push(rowObj.viewer_url.replace(process.env.HOST_NAME, ''))
                if (rowObj.recorder_url) paths.push(rowObj.recorder_url.replace(process.env.HOST_NAME, ''))
                try {
                    logger.debug('paths', paths);
                    const iotas = await Iota.find({ path: { $in: paths } })
                    logger.debug('iotas', iotas)
                    if (iotas?.length) updateElectionInfo.call(this, id, id, iotas)
                } catch (err) {
                    if (cb) cb()
                    logger.error('createCandidateRecorder could not updateElectionInfo', id, err)
                }
            }

            if (cb) cb({ rowObjs, messages })
        })
    } catch (err) {
        logger.error('createCandidateRecorder caught err', err)
        if (cb) cb()
    }
}

export async function createCandidateRecordersFromIdAndElectionObj(id, filter, electionObj) {
    let msgs
    if ((msgs = reasonsNotReadyForCandidateRecorder(electionObj)).length) {
        logger.error('createCandidateRecordersFromIdAndElectionObj not ready for candidate recorder:', msgs)
        return {}
    }
    const filterOp = candidateFilters[filter]
    if (!filterOp) {
        logger.error('createCandidateRecordersFromIdAndElectionObj for election id', id, 'filter not found', filter)
        return {}
    }
    const sortedQuestionPairs = Object.entries(electionObj.questions).sort(([aKey, aObj], [bKey, bObj]) => aKey - bKey)
    const agenda = sortedQuestionPairs.map(([key, Obj]) => [Obj.text])
    agenda.push(['Thank You'])
    const timeLimits = sortedQuestionPairs.map(([key, Obj]) => Obj.time)

    console.log(electionObj.moderator);
    console.log(electionObj.moderator.submissions);
    const moderatorComponent = getLatestIota(electionObj.moderator.submissions).component
    const speaking = moderatorComponent.participant.speaking.slice()

    // for the candidate recorder, there is an enciv prepared segment at the beginning introducing how this works
    // and asking them to record a placeholder video
    const recorderSpeaking = speaking.slice()
    recorderSpeaking.unshift(introVideo)
    const recorderAgenda = agenda.slice()
    recorderAgenda.unshift(['How this works', 'Record placeholder'])
    const recorderTimeLimits = timeLimits.slice()
    recorderTimeLimits.unshift(15)

    const viewerRecorder = new sspViewerRecorder(electionObj)

    viewerRecorder.candidateRecorder.component.participants.moderator.speaking = recorderSpeaking
    viewerRecorder.candidateRecorder.component.participants.moderator.listening =
        moderatorComponent.participant.listening
    viewerRecorder.candidateRecorder.component.participants.moderator.agenda = recorderAgenda
    viewerRecorder.candidateRecorder.component.participants.moderator.timeLimits = recorderTimeLimits

    viewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking
    viewerRecorder.candidateViewer.webComponent.participants.moderator.name = electionObj.moderator.name
    viewerRecorder.candidateViewer.webComponent.participants.moderator.listening =
        moderatorComponent.participant.listening
    viewerRecorder.candidateViewer.parentId = id
    viewerRecorder.candidateViewer.webComponent.participants.moderator.agenda = agenda
    viewerRecorder.candidateViewer.webComponent.participants.moderator.timeLimits = timeLimits

    const { rowObjs, messages } = await undebatesFromTemplateAndRows(
        viewerRecorder,
        Object.values(electionObj.candidates).filter(filterOp)
    )
    return { rowObjs, messages }
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
    ;['name', 'email', 'office'].forEach(prop => {
        Object.values(electionObj.candidates).forEach(candidate => {
            if (!(candidate || {})[prop]) errorMsgs.push(`candidate ${prop} required`)
        })
    })
    return errorMsgs
}
