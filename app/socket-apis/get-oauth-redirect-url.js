import { google } from 'googleapis'
import { redirectUrl } from '../routes/oauth-redirect'

export default async function getOauthRedirectUrl(uniqueId, scope, cb) {
    if (!this.synuser) {
        logger.error('extractSheetData called, but no user ', this.synuser)
        if (cb) cb() // no user
        return
    }
    try {
        // Decided to put the oauth client in here instead of generating the auth url manually clientside
        // so that if google ever changes their auth url we just have to update the googleapis package version
        // and don't have to manually update the urls.
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        )

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

;['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'].reduce((allExist, name) => {
    if (!process.env[name]) {
        logger.error('env', name, 'not set. Paste Google Sheets authentication will not work')
        return false
    } else return allExist
}, true)
