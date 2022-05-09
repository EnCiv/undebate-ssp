import { google } from 'googleapis'
import { oauth2callbacks } from '../routes/google-auth-redirect'

// todo document these
// todo fix redirect url
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3011/googleAuthRedirect'
)

const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly'

function getSheetsData(spreadsheetId, cb) {
    // todo actual implementation
    logger.debug('get sheets data', spreadsheetId)
    // unfortunately, this won't work because the socket has already been responded to so this callback is no longer valid
    cb('sheetData', JSON.stringify({ stuff: 'things' }))
}

export default async function extractSheetData(uniqueId, spreadsheetId, cb) {
    // todo add back in
    /* if (!this.synuser) {
     *     logger.error('extractSheetData called, but no user ', this.synuser)
     *     if (cb) cb() // no user
     *     return
     * } */
    try {
        oauth2callbacks.push({
            uniqueId,
            oauth2Client,
            callback: () => getSheetsData(spreadsheetId, cb),
        })
        // for now assume we are not signed in every time. todo later add actual check

        const authorizationUrl = oauth2Client.generateAuthUrl({
            scope: scope,
            include_granted_scopes: true,
            state: uniqueId,
        })
        cb({ status: 'notSignedIn', authUrl: authorizationUrl })
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}
