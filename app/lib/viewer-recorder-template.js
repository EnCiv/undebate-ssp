'use strict'
const S = require('underscore.string')
const MongoModels = require('mongo-models')
import scheme from '../lib/scheme'

const hostName = process.env.HOSTNAME ? scheme() + process.env.HOSTNAME : 'https://cc.enciv.org'

// todo export this from common package

function date_dash(date) {
    if (date.split('/').length > 1) {
        let mdy = date.split('/')
        return mdy[2] + '-' + mdy[0] + '-' + mdy[1]
    }
    return date
}

export default class viewerRecorderTemplate {
    // getIotaPropertyFromCSVColumn shortened to gFC
    // these are the getters and setters that should be modified to fit with different data sources
    gFC = {
        type_name: () => 'org', // used in url path
        type_id: row => 'cfa', // must be globaly unique used in url path
        election_date: row => '03/21/2021', // this is the last date of the election in MM/DD/YY format
        candidate_name: row => row['Name'], // get the candidate name from a row
        office: row => row['Seat'], // get the office name from a row
        candidate_emails: row => [row['Email']], // get the candidate's email address
        unique_id: row => row['unique_id'], // get the unique id for the candidate (if there isn't one, it will be assigned)
        set: {
            unique_id: (row, val) => (row['unique_id'] = val), // set the unique_id of the canidate in a row - won't be called if it's already set
        },
        party: row => '', // the party the candidate belongs to
        viewer_url_name: () => 'viewer_url', // property name for accessing the viewer_url in the row - once a viewer url has been set if it has to be changed, the update_url property in the row will be set
        recorder_url_name: () => 'recorder_url', // property name for accessing the recorder url in the row - once a recorder url has been set - if it has to be changed, the update_url property in the row will be set
        url_update_name: name => name + '_updated', // property name to set in row if viewer or recorder url has to be changed
        lastname: row => row['Name'].split(' ').reduce((acc, word) => word, ''), // the last word in the full name will be the last name
        election_source: () => 'CodeForAmerica.NAC', // the full name source of the election. So far just for visual reference
    }
    electionList = []
    setup = function (csvRowObjList) {
        // make a list of all the elections in the table, so each viewer can navigate to other ones
        this.electionList = csvRowObjList.reduce((acc, rowObj) => {
            let viewer_path = this.viewerPath(rowObj)
            if (!acc.includes(viewer_path)) acc.push(viewer_path)
            return acc
        }, [])
    }
    viewerPath = function (csvRowObj) {
        // ()=> here will not get 'this'
        return `/country:us/${this.gFC.type_name()}:${this.gFC.type_id(csvRowObj).toLowerCase()}/office:${S(
            this.gFC.office(csvRowObj)
        )
            .slugify()
            .value()}/${date_dash(this.gFC.election_date(csvRowObj))}`
    }
    recorderPath = function (csvRowObj) {
        return this.viewerPath(csvRowObj) + '-recorder-' + this.gFC.unique_id(csvRowObj)
    }
    overWriteViewerInfo = function (newViewer, csvRowObj) {
        newViewer.path = this.viewerPath(csvRowObj)
        newViewer.subject = this.gFC.office(csvRowObj)
        newViewer.description = 'A Candidate Conversation for: ' + this.gFC.office(csvRowObj)
        newViewer.bp_info.electionList = this.electionList
        newViewer.bp_info.office = this.gFC.office(csvRowObj)
        newViewer.bp_info.election_date = this.gFC.election_date(csvRowObj)
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
        newViewer.bp_info.election_source = this.gFC.election_source(csvRowObj)
    }
    overWriteRecorderInfo = function (newRecorder, viewerObj, csvRowObj) {
        newRecorder.subject = this.gFC.office(csvRowObj) + '-Candidate Recorder'
        newRecorder.description = 'A Candidate Recorder for the undebate: ' + this.gFC.office(csvRowObj)
        newRecorder.bp_info.office = this.gFC.office(csvRowObj)
        newRecorder.bp_info.election_date = this.gFC.election_date(csvRowObj)
        newRecorder.bp_info.candidate_name = this.gFC.candidate_name(csvRowObj)
        newRecorder.bp_info.last_name = this.gFC.lastname(csvRowObj)
        if (this.gFC.unique_id(csvRowObj)) newRecorder.bp_info.unique_id = this.gFC.unique_id(csvRowObj)
        else if (newRecorder.bp_info.unique_id) {
            if (this.gFC.unique_id(csvRowObj) !== newRecorder.bp_info.unique_id)
                console.error(
                    'overWriteRecorderInfo',
                    this.gFC.unique_id(csvRowObj),
                    '!==',
                    newRecorder.bp_info.unique_id
                )
            this.gFC.set.unique_id(csvRowObj, newRecorder.bp_info.unique_id)
        } else {
            newRecorder.bp_info.unique_id = this.gFC.set.unique_id(csvRowObj, new MongoModels.ObjectID().toString()) // if no id make a unique one
        }
        newRecorder.path = this.recorderPath(csvRowObj) // must set raceObject.unique_id before calling this
        newRecorder.bp_info.candidate_emails = this.gFC.candidate_emails(csvRowObj)
        newRecorder.bp_info.party = this.gFC.party(csvRowObj)
        newRecorder.bp_info.election_source = this.gFC.election_source(csvRowObj)
        newRecorder.parentId = viewerObj._id.toString()
    }
    updateLinkProperty = function (csvRowObj, property, path) {
        if (csvRowObj[property] && csvRowObj[property].length) {
            if (csvRowObj[property] !== hostName + path) {
                csvRowObj[property] = hostName + path
                csvRowObj[this.gFC.url_update_name(property)] = 'yes'
            } else {
                csvRowObj[this.gFC.url_update_name(property)] = ''
            }
        } else {
            csvRowObj[property] = hostName + path
            csvRowObj[this.gFC.url_update_name(property)] = 'yes'
        }
    }
    updateProperties = function (csvRowObj, viewerObj, recorderObj) {
        this.updateLinkProperty(csvRowObj, this.gFC.recorder_url_name(), recorderObj.path)
        this.updateLinkProperty(csvRowObj, this.gFC.viewer_url_name(), viewerObj.path)
        if (!this.gFC.unique_id(csvRowObj) && recorderObj.bp_info.unique_id)
            this.gFC.set.unique_id(csvRowObj, recorderObj.bp_info.unique_id)
    }
    getViewer = function (csvRowObj) {
        return this['candidateViewer']
    }
    getRecorder = function (csvRowObj) {
        return this['candidateRecorder']
    }
    candidateViewer = {
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
    }

    candidateRecorder = {
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
    }
}
