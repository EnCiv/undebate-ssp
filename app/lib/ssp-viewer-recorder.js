import viewerRecorderTemplate from './viewer-recorder-template'
import S from 'underscore.string'

export default class sspViewerRecorder extends viewerRecorderTemplate {
    constructor(electionObj) {
        super()
        const YYYY_MM_DD = electionObj.electionDate.split('T')[0].split('-')
        const electionDate = YYYY_MM_DD[1] + '/' + YYYY_MM_DD[2] + '/' + YYYY_MM_DD[0]
        let type_id
        try {
            type_id = S(new URL(electionObj.organizationUrl).hostname).slugify().value()
        } catch (err) {
            // new URL() could thow an error
            type_id = S(electionObj.organizationName || '')
                .slugify()
                .value()
        }
        type_id = type_id + ':' + S(electionObj.electionName).slugify().value() // electionName so unique if admin creates 2 elections with same date
        this.gFC = {
            type_name: () => 'org', // used in url path
            type_id: row => type_id, // must be globaly unique used in url path
            election_date: row => electionDate, // this is the last date of the election in MM/DD/YY format
            candidate_name: row => row['name'], // get the candidate name from a row
            office: row => row['office'], // get the office name from a row
            candidate_emails: row => [row['email']], // get the candidate's email address
            unique_id: row => row['uniqueId'], // get the unique id for the candidate (if there isn't one, it will be assigned)
            set: {
                unique_id: (row, val) => (row['uniqueId'] = val), // set the unique_id of the canidate in a row - won't be called if it's already set
            },
            party: row => '', // the party the candidate belongs to
            viewer_url_name: () => 'viewer_url', // property name for accessing the viewer_url in the row - once a viewer url has been set if it has to be changed, the update_url property in the row will be set
            recorder_url_name: () => 'recorder_url', // property name for accessing the recorder url in the row - once a recorder url has been set - if it has to be changed, the update_url property in the row will be set
            url_update_name: name => name + '_updated', // property name to set in row if viewer or recorder url has to be changed
            lastname: row => row['name'].split(' ').reduce((acc, word) => word, ''), // the last word in the full name will be the last name
            election_source: () => electionObj.organizationName, // the full name source of the election. So far just for visual reference
        }
    }
}
