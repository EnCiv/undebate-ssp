import { google } from 'googleapis'
import { oauth2callbacks, redirectUrl } from '../routes/oauth-redirect'

async function getSheetsData(oAuthCode, spreadsheetId, cb) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    )
    let { tokens } = await oauth2Client.getToken(oAuthCode)
    oauth2Client.setCredentials(tokens)

    const SHEET_VALUES_RANGE = 'A:ZZ'
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })
    let res
    try {
        res = await sheets.spreadsheets.values.get({
            auth: oauth2Client,
            spreadsheetId: spreadsheetId,
            range: SHEET_VALUES_RANGE,
        })
        if (res && res.data && res.data.values) {
            cb(JSON.stringify(res.data.values))
        } else {
            cb()
        }
    } catch (err) {
        logger.error('error trying to get data from spreadsheetId: ' + spreadsheetId, err)
        if (err.message.includes('The caller does not have permission')) {
            cb("Can't authenticate")
        } else {
            cb('General error')
        }
    }
}

function removeOldCallback(uniqueId) {
    const index = oauth2callbacks.findIndex(obj => obj.uniqueId === uniqueId)
    if (index >= 0) {
        oauth2callbacks.splice(index, 1)
    }
}

export default async function extractSheetData(uniqueId, spreadsheetId, cb) {
    if (!this.synuser) {
        logger.error('extractSheetData called, but no user ', this.synuser)
        if (cb) cb() // no user
        return
    }
    try {
        // this is the second socket call so we add the callback to the oauth2callbacks list item so that the data gets back to the browser
        oauth2callbacks.push({ uniqueId, callback: oAuthCode => getSheetsData(oAuthCode, spreadsheetId, cb) })
        // remove the item from the list after 2 minutes to ensure no memory leaks
        setTimeout(() => removeOldCallback(uniqueId), 2 * 60 * 1000)
    } catch (err) {
        logger.error('err', err)
        if (cb) cb()
    }
}
