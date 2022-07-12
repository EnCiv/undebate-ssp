'use strict'
const S = require('underscore.string')
const MongoModels = require('mongo-models')

/**
 * CSV File format
 *
 * Ballot Name,	Office,	Slate,	Email Address,	unique_id,	recorder_url,	recorder_url_updated,	viewer_url,	viewer_url_updated
 *
 */

const hostName = process.env.HOST_NAME || 'https://cc.enciv.org'

// todo export this from common package
const getIotaPropertyFromCSVColumn = {
    type_name: () => 'organization',
    type_id: row => 'cfa',
    election_date: row => '03/21/2021',
    candidate_name: row => row['Name'],
    office: row => row['Seat'],
    candidate_emails: row => [row['Email']],
    unique_id: row => row['unique_id'],
    set: {
        unique_id: (row, val) => (row['unique_id'] = val),
    },
    party: row => '',
    viewer_url_name: () => 'viewer_url',
    recorder_url_name: () => 'recorder_url',
    url_update_name: name => name + '_updated',
    lastname: row => row['Name'].split(' ').reduce((acc, word) => word, ''), // the last word in full name will be the last name
    election_source: () => 'CodeForAmerica.NAC',
}

function date_dash(date) {
    if (date.split('/').length > 1) {
        let mdy = date.split('/')
        return mdy[2] + '-' + mdy[0] + '-' + mdy[1]
    }
}

// todo refactor for duplicates in moderator viewer recorder
const candidateViewerRecorder = {
    electionList: [],
    setup: function (csvRowObjList) {
        // make a list of all the elections in the table, so each viewer can navigate to other ones
        this.electionList = csvRowObjList.reduce((acc, rowObj) => {
            let viewer_path = this.viewerPath(rowObj)
            if (!acc.includes(viewer_path)) acc.push(viewer_path)
            return acc
        }, [])
    },
    viewerPath: function (csvRowObj) {
        // () => here will not get 'this'
        return `/country:us/${getIotaPropertyFromCSVColumn.type_name()}:${getIotaPropertyFromCSVColumn
            .type_id(csvRowObj)
            .toLowerCase()}/office:${S(getIotaPropertyFromCSVColumn.office(csvRowObj)).slugify().value()}/${date_dash(
            getIotaPropertyFromCSVColumn.election_date(csvRowObj)
        )}`
    },
    recorderPath: function (csvRowObj) {
        return this.viewerPath(csvRowObj) + '-recorder-' + getIotaPropertyFromCSVColumn.unique_id(csvRowObj)
    },
    overWriteViewerInfo: function (newViewer, csvRowObj) {
        newViewer.path = this.viewerPath(csvRowObj)
        newViewer.subject = getIotaPropertyFromCSVColumn.office(csvRowObj)
        newViewer.description = 'A Candidate Conversation for: ' + getIotaPropertyFromCSVColumn.office(csvRowObj)
        newViewer.bp_info.electionList = this.electionList
        newViewer.bp_info.office = getIotaPropertyFromCSVColumn.office(csvRowObj)
        newViewer.bp_info.election_date = getIotaPropertyFromCSVColumn.election_date(csvRowObj)
        let nextPrev = this.electionList.reduce((acc, viewerPath) => {
            if (acc.nextElection);
            else if (acc.found)
                // after this is set there's nothing to do
                acc.nextElection = viewerPath
            else if (viewerPath === newViewer.path) acc.found = true
            else acc.prevElection = viewerPath
            return acc
        }, {})
        if (nextPrev.nextElection) newViewer.bp_info.nextElection = nextPrev.nextElection
        if (nextPrev.prevElection) newViewer.bp_info.prevElection = nextPrev.prevElection
        newViewer.bp_info.election_source = getIotaPropertyFromCSVColumn.election_source(csvRowObj)
    },
    overWriteRecorderInfo: function (newRecorder, viewerObj, csvRowObj) {
        newRecorder.subject = getIotaPropertyFromCSVColumn.office(csvRowObj) + '-Candidate Recorder'
        newRecorder.description =
            'A Candidate Recorder for the undebate: ' + getIotaPropertyFromCSVColumn.office(csvRowObj)
        newRecorder.bp_info.office = getIotaPropertyFromCSVColumn.office(csvRowObj)
        newRecorder.bp_info.election_date = getIotaPropertyFromCSVColumn.election_date(csvRowObj)
        newRecorder.bp_info.candidate_name = getIotaPropertyFromCSVColumn.candidate_name(csvRowObj)

        newRecorder.bp_info.last_name = getIotaPropertyFromCSVColumn.lastname(csvRowObj)
        if (getIotaPropertyFromCSVColumn.unique_id(csvRowObj))
            newRecorder.bp_info.unique_id = getIotaPropertyFromCSVColumn.unique_id(csvRowObj)
        else if (newRecorder.bp_info.unique_id) {
            if (getIotaPropertyFromCSVColumn.unique_id(csvRowObj) !== newRecorder.bp_info.unique_id)
                console.error(
                    'overWriteRecorderInfo',
                    getIotaPropertyFromCSVColumn.unique_id(csvRowObj),
                    '!==',
                    newRecorder.bp_info.unique_id
                )
            getIotaPropertyFromCSVColumn.set.unique_id(csvRowObj, newRecorder.bp_info.unique_id)
        } else {
            newRecorder.bp_info.unique_id = getIotaPropertyFromCSVColumn.set.unique_id(
                csvRowObj,
                new MongoModels.ObjectID().toString()
            ) // if no id make a unique one
        }
        newRecorder.path = this.recorderPath(csvRowObj) // must set raceObject.unique_id before calling this
        newRecorder.bp_info.candidate_emails = getIotaPropertyFromCSVColumn.candidate_emails(csvRowObj)
        newRecorder.bp_info.party = getIotaPropertyFromCSVColumn.party(csvRowObj)
        newRecorder.bp_info.election_source = getIotaPropertyFromCSVColumn.election_source(csvRowObj)
        newRecorder.parentId = viewerObj._id.toString()
    },
    updateLinkProperty: function (csvRowObj, property, path) {
        if (csvRowObj[property] && csvRowObj[property].length) {
            if (csvRowObj[property] !== hostname + path) {
                csvRowObj[property] = hostname + path
                csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = 'yes'
            } else {
                csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = ''
            }
        } else {
            csvRowObj[property] = hostName + path
            csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = 'yes'
        }
    },
    updateProperties: function (csvRowObj, viewerObj, recorderObj) {
        this.updateLinkProperty(csvRowObj, getIotaPropertyFromCSVColumn.recorder_url_name(), recorderObj.path)
        this.updateLinkProperty(csvRowObj, getIotaPropertyFromCSVColumn.viewer_url_name(), viewerObj.path)
    },
    getViewer: function (csvRowObj) {
        return this['candidateViewer']
    },
    getRecorder: function (csvRowObj) {
        return this['candidateRecorder']
    },
    candidateViewer: {
        // properties that are commented out so prevent messages about their are being changed when they are overwriten by whats in the CSV file
        //"path": "",
        //"subject": "",
        //"description": "",
        component: {
            component: 'MergeParticipants',
        },
        webComponent: {
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
                    speaking: [],
                    name: '',
                    listening: '',
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
        },
        bp_info: {
            //election_source:
            //election_list: []
        },
    },

    candidateRecorder: {
        //"path": "",
        //"subject": "",
        //"description": "",
        component: {
            component: 'UndebateCreator',
            participants: {
                moderator: {
                    speaking: [''],
                    name: '',
                    listening: '',
                    agenda: [[]],
                    timeLimits: [30],
                },
                human: {
                    listening: {
                        round: 0,
                        seat: 'speaking',
                    },
                },
            },
        },
        webComponent: {
            webComponent: 'Undebate',
            logo: 'undebate',
            instructionLink: '',
            participants: {},
            opening: { noPreamble: false },
            closing: {
                thanks: 'Thank You.',
                iframe: {
                    src: 'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
                    width: 640,
                    height: 1550,
                },
            },
        },
        bp_info: {
            //election_source:
            //"office": "Illinois House of Representatives District 38",
            //"party": null,
            //"unique_id": "92251",
            //"election_date": "2020-11-03",
            //"candidate_name": "Max Solomon",
            //"last_name": "Solomon",
            //"candidate_emails": [],
            //"person_emails": []
        },
        //        "parentId": ""
    },
}

export default candidateViewerRecorder
