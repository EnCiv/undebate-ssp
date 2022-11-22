import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota } from 'civil-server'
import '../../lib/jest-setup'
const ObjectID = Iota.ObjectID

// watch requires replSet in /jest-mongodb-config.js
const moderatorRecording = {
    _id: ObjectID('637d1e92a64e1a85894c198d'),
    parentId: '6372baf15f6dea0017c8fa16',
    subject: 'Participant:Moderator-Candidate Recorder',
    description: 'A participant in the following discussion:A Candidate Recorder for the undebate: Moderator',
    component: {
        component: 'MergeParticipants',
        participant: {
            speaking: [
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4',
            ],
            name: 'David Moderator F',
            listening:
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4',
            bp_info: {
                office: 'Moderator',
                election_date: '12/05/2022',
                candidate_name: 'David Moderator F',
                last_name: 'F',
                unique_id: '6372baf15f6dea0017c8fa17',
                candidate_emails: ['joe@mail.org'],
                party: '',
                election_source: 'EnCiv, Inc',
            },
        },
    },
    userId: '6303f6bbb2d45f001797bf98',
}

describe('Test collection.watch', () => {
    jest.setTimeout(60000)
    beforeAll(async () => {
        await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
        // run the init functions that models require - after the connection is setup
        const { toInit = [] } = MongoModels.toInit
        MongoModels.toInit = []
        // eslint-disable-next-line no-restricted-syntax
        for await (const init of toInit) await init()
    })

    afterAll(async () => {
        MongoModels.disconnect()
    })
    test('Iota.watch should return one when created', done => {
        async function startWatch() {
            const watchCursor = await Iota.watch([], {
                fullDocument: 'updateLookup',
            })
            watchCursor.on('change', change => {
                expect(change.fullDocument).toMatchInlineSnapshot(`
                                    Object {
                                      "_id": "637d1e92a64e1a85894c198d",
                                      "component": Object {
                                        "component": "MergeParticipants",
                                        "participant": Object {
                                          "bp_info": Object {
                                            "candidate_emails": Array [
                                              "joe@mail.org",
                                            ],
                                            "candidate_name": "David Moderator F",
                                            "election_date": "12/05/2022",
                                            "election_source": "EnCiv, Inc",
                                            "last_name": "F",
                                            "office": "Moderator",
                                            "party": "",
                                            "unique_id": "6372baf15f6dea0017c8fa17",
                                          },
                                          "listening": "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4",
                                          "name": "David Moderator F",
                                          "speaking": Array [
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4",
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4",
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4",
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4",
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4",
                                            "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4",
                                          ],
                                        },
                                      },
                                      "description": "A participant in the following discussion:A Candidate Recorder for the undebate: Moderator",
                                      "parentId": "6372baf15f6dea0017c8fa16",
                                      "subject": "Participant:Moderator-Candidate Recorder",
                                      "userId": "6303f6bbb2d45f001797bf98",
                                    }
                            `)
                watchCursor.close()
                done()
            })
        }
        startWatch()
        // this doesn't cause an event, but the setTimeout below does Iota.create(moderatorRecording)
        setTimeout(async () => {
            const result = await Iota.create(moderatorRecording)
            expect(result).toMatchInlineSnapshot(`
                Iota {
                  "_id": "637d1e92a64e1a85894c198d",
                  "component": Object {
                    "component": "MergeParticipants",
                    "participant": Object {
                      "bp_info": Object {
                        "candidate_emails": Array [
                          "joe@mail.org",
                        ],
                        "candidate_name": "David Moderator F",
                        "election_date": "12/05/2022",
                        "election_source": "EnCiv, Inc",
                        "last_name": "F",
                        "office": "Moderator",
                        "party": "",
                        "unique_id": "6372baf15f6dea0017c8fa17",
                      },
                      "listening": "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4",
                      "name": "David Moderator F",
                      "speaking": Array [
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4",
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4",
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4",
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4",
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4",
                        "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4",
                      ],
                    },
                  },
                  "description": "A participant in the following discussion:A Candidate Recorder for the undebate: Moderator",
                  "parentId": "6372baf15f6dea0017c8fa16",
                  "subject": "Participant:Moderator-Candidate Recorder",
                  "userId": "6303f6bbb2d45f001797bf98",
                }
            `)
        })
    })
})
