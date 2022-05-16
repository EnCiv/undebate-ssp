import { google } from 'googleapis'
import { oauth2callbacks } from '../routes/google-auth-redirect'

const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly'

export default async function isSignedInForSheet(uniqueId, spreadsheetId, cb) {
    // todo add back in
    /* if (!this.synuser) {
     *     logger.error('extractSheetData called, but no user ', this.synuser)
     *     if (cb) cb() // no user
     *     return
     * } */
    try {
        // Decided to put the oauth client in here instead of generating the auth url manually clientside
        // so that if google ever changes their auth url we just have to update the googleapis package version
        // and don't have to manually update the urls.

        // todo fix redirect url to property
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3011/googleAuthRedirect'
        )
        // can't add the callback itself yet as that has to come from the next socket call
        oauth2callbacks.push({
            uniqueId,
            oauth2Client,
        })
        // for now we assume the user is not signed in to google for every request

        const authorizationUrl = oauth2Client.generateAuthUrl({
            scope: scope,
            include_granted_scopes: true,
            state: uniqueId,
        })
        cb(authorizationUrl)
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}
