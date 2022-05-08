// https://github.com/EnCiv/undebate-ssp/issues/127

import { Iota } from 'civil-server'
import { undebatesFromTemplateAndRows } from 'undebate'

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

export default async function createCandidateRecorder(id, cb) {
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
        const iota = await Iota.findOne({ _id: Iota.ObjectId(id) })
        if (!iota) {
            if (cb) cb()
            return
        }
        const electionObj = iota.webComponent
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}
