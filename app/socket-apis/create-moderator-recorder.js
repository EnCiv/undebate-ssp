// https://github.com/EnCiv/undebate-ssp/issues/106

import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'

import sspViewerRecorder from '../lib/ssp-viewer-recorder'
import { updateElectionInfo } from './subscribe-election-info'
import { defaults as scriptDefaults } from '../components/script'

export const defaults = {
    introAndPlaceHolder:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4',
    timeForIntros:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-2-speaking20210304T213515529Z.mp4', // not currently used
    firstQuestion:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4',
    superNextQuestion:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-4-speaking20210304T213517050Z.mp4',
    awesomeNowAnother:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
    splendidLastQuestion:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
    awesomeClosing:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
    allDone:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
    listening:
        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
    enCivModeratorName: 'David Fridley, EnCiv',
}

export default async function createModeratorRecorder(id, cb) {
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
            logger.error("crete-moderator-recorder counldn't because:", id, msgs)
            if (cb) cb()
            return
        }
        /*
We are not giving the moderator a uniqueId.  Subsequent regenerations of the recorder will generate new 
recorder Iotas.  But if the admin ends up changing who the moderator is, the new uniqueId will be a benefit

        if(!electionObj?.moderator?.uniqueId){
            const uniqueId=Iota.ObjectId().toString()
            findAndSetElectionDoc.call(this,{_id: id}, {moderator: uniqueId}, result=>{
                if(!result) logger.error('createModeratorRecorder caught error trying to set moderator.uniqueId for id:',id)
            })
        }
*/
        const sortedQuestionPairs = Object.entries(electionObj.questions).sort(
            ([aKey, aObj], [bKey, bObj]) => aKey - bKey
        )
        const agenda = sortedQuestionPairs.map(([key, Obj]) => [Obj.text || '']) // don't want undefined
        const timeLimits = sortedQuestionPairs.map(([key, Obj]) => Obj.time || '60') //

        // the sequence of videos of the EnCiv moderator instucting the election moderator goes like this
        // always make the intro and instruct to record a placeholder
        const speaking = [defaults.introAndPlaceHolder]
        // then instruct to ask the first question
        if (agenda.length >= 1) speaking.push(defaults.firstQuestion)
        // then alternate between superNextQuestion and awesomeNowAnother until, but not including the last question
        let speakingCount = 1
        for (; speakingCount < agenda.length - 1; speakingCount++)
            speaking.push(speakingCount.length % 2 ? defaults.superNextQuestion : defaults.awesomeNowAnother)
        // then instruct to ask the last question, but not if there was only one question
        if (speakingCount < agenda.length) speaking.push(defaults.splendidLastQuestion)
        // then instruct to make the closing
        speaking.push(defaults.awesomeClosing)
        // then instruct how to finish
        speaking.push(defaults.allDone)

        const viewerRecorder = new sspViewerRecorder(electionObj)

        // customize the viewer recorder for this election
        viewerRecorder.candidateRecorder.component.participants.moderator.name = defaults.enCivModeratorName
        viewerRecorder.candidateRecorder.component.participants.moderator.speaking = speaking
        viewerRecorder.candidateRecorder.component.participants.moderator.listening = defaults.listening

        agenda.unshift(['How this works', 'Placeholder'])
        agenda.push(['Make your closing - to the audience'])
        agenda.push(['Thank you'])

        const maxTimeLimit = (scriptDefaults.maxWordCount / scriptDefaults.wordsPerMin) * 60
        const recorderTimeLimits = [15].concat(timeLimits.map((t, i) => maxTimeLimit)).concat(maxTimeLimit) // moderater gets 15 seconds for placeholder, and then the script max time to ask each question, and that much time again for the closing

        viewerRecorder.candidateRecorder.component.participants.moderator.agenda = agenda
        viewerRecorder.candidateRecorder.component.participants.moderator.timeLimits = recorderTimeLimits
        viewerRecorder.candidateRecorder.component.participants.human.name = electionObj.moderator.name

        viewerRecorder.candidateViewer.webComponent.participants.moderator.name = defaults.enCivModeratorName
        viewerRecorder.candidateViewer.webComponent.participants.moderator.speaking = speaking.slice(1) // viewer doesn't get the placeholder recording step
        viewerRecorder.candidateViewer.webComponent.participants.moderator.listening = defaults.listening
        viewerRecorder.candidateViewer.webComponent.participants.moderator.agenda = agenda.slice(1) // viewer doesn't get the placeholder recording step
        viewerRecorder.candidateViewer.webComponent.participants.moderator.timeLimits = timeLimits
        viewerRecorder.candidateViewer.parentId = id

        const { rowObjs, messages } = await undebatesFromTemplateAndRows(viewerRecorder, [
            { office: 'Moderator', ...electionObj.moderator },
        ])
        if (!rowObjs) {
            if (cb) cb()
            return
        }
        // to do: rowObjs has the viewer and recorder links, plus an indicator if they'v changed
        // do we add that info to electionObj.moderator ???

        // undebatesFromTemplateAndRows doesn't return the new iotas, and doesn't generate events for the new iotas
        // here is a kludge for now, to get the new Iotas and update and browsers subscribed to election info
        // likely the user who just called create-moderator-recorders
        const paths = []
        try {
            if (rowObjs[0].viewer_url) paths.push(new URL(rowObjs[0].viewer_url).pathname)
            if (rowObjs[0].recorder_url) paths.push(new URL(rowObjs[0].recorder_url).pathname)
            const iotas = await Iota.find({ path: { $in: paths } })
            if (iotas?.length) updateElectionInfo.call(this, id, id, iotas)
            else logger.error('createModeratorRecorder cound not find what it tried to create.', id)
        } catch (err) {
            if (cb) cb()
            logger.error('createModeratorRecorder could not updateElectionInfo', id, err)
        }
        if (cb) cb({ rowObjs, messages })
    } catch (err) {
        logger.error('createModeratorRecorder caught err', err)
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
