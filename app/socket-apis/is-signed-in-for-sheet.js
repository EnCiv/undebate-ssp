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
        // so that if google ever changes their auth url we just have to update the googleapis package and
        // don't have to manually update the urls.

        // todo fix redirect url
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
        // for now assume we are not signed in every time. todo later add actual check

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
