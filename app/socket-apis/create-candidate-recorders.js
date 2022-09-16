// https://github.com/EnCiv/undebate-ssp/issues/127
import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'
import { updateElectionInfo } from './subscribe-election-info'
import sspViewerRecorder from '../lib/ssp-viewer-recorder'
import { getElectionDocById } from './get-election-docs'
import { getLatestIota, candidateFilters } from '../lib/get-election-status-methods'

const introVideo =
    'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1661378414/621e826899902756d4ba49f5-0-speaking20220824T220002681Z.mp4'
const introVideoName = 'David Fridley, EnCiv'
const introListening =
    'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1661378417/621e826899902756d4ba49f5-0-listening20220824T220015791Z.mp4'

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
            // to do: rowObjs has the candidates table plus the viewer and recorder links, plus an indicator if they'v changed
            // do we add that info to the candidates table
            if (cb) cb({ rowObjs, messages })
        })
    } catch (err) {
        logger.error('err', err)
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
    viewerRecorder.candidateRecorder.component.participants.moderator.names = [introVideoName]
    viewerRecorder.candidateRecorder.component.participants.moderator.names.fill(
        moderatorComponent.participant.name,
        1,
        recorderSpeaking.length
    )
    viewerRecorder.candidateRecorder.component.participants.moderator.listeningURLs = [introListening]
    viewerRecorder.candidateRecorder.component.participants.moderator.listeningURLs.fill(
        moderatorComponent.participant.listening,
        1,
        recorderSpeaking.length
    )
    viewerRecorder.candidateRecorder.component.participants.moderator.name = moderatorComponent.participant.name // names above will superseed
    viewerRecorder.candidateRecorder.component.participants.moderator.listening =
        moderatorComponent.participant.listening // listeningURLs above will superseed
    viewerRecorder.candidateRecorder.component.participants.moderator.agenda = recorderAgenda
    viewerRecorder.candidateRecorder.component.participants.moderator.timeLimits = recorderTimeLimits

    viewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking
    viewerRecorder.candidateViewer.webComponent.participants.moderator.name = moderatorComponent.participant.name
    viewerRecorder.candidateViewer.webComponent.participants.moderator.listening =
        moderatorComponent.participant.listening
    viewerRecorder.candidateViewer.parentId = id
    viewerRecorder.candidateViewer.webComponent.participants.moderator.agenda = agenda
    viewerRecorder.candidateViewer.webComponent.participants.moderator.timeLimits = timeLimits

    const { rowObjs, messages } = await undebatesFromTemplateAndRows(
        viewerRecorder,
        Object.values(electionObj.candidates).filter(filterOp)
    )
    // undebatesFromTemplateAndRows doesn't return the new iotas, and doesn't generate events for the new iotas
    // here is a kludge for now, to get the new Iotas and update and browsers subscribed to election info
    // likely the user who just called create-moderator-recorders

    // subscribed browsers need updates on the viewers for the offices we ard doing the recorders for consistency
    // the same viewer will appear in multiple rows - so we de-dup the array using Set
    let paths = new Set()
    try {
        for (const row of rowObjs) {
            try {
                const v_url = new URL(row.viewer_url).pathname
                if (v_url) paths.add(v_url)
                const r_url = new URL(row.recorder_url).pathname
                if (r_url) paths.add(r_url)
            } catch (err) {
                logger.error('create-candidate-recorders URL not valid in row', row) // URL() could Throw, just ignore it and move on
            }
        }
        const iotas = await Iota.find({ path: { $in: [...paths] } })
        if (iotas?.length) updateElectionInfo.call(this, id, id, iotas)
        else logger.error('createModeratorRecorder cound not find what it tried to create.', id)
    } catch (err) {
        logger.error('createModeratorRecorder could not updateElectionInfo', id, err)
    }
    return { rowObjs, messages }
}

function reasonsNotReadyForCandidateRecorder(electionObj) {
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
    if (Object.keys(electionObj?.moderator?.submissions || {}).length < 1) errorMsgs.push('No moderator submission yet')
    return errorMsgs
}
