export const oauth2callbacks = []
import scheme from '../lib/scheme'

async function oauthRedirect(req, res, next) {
    // this is what gets called after the user has consented to the app reading their spreadsheets
    if (!req.query.code) return next()
    if (!req.query.state) return next()

    const index = oauth2callbacks.findIndex(obj => obj.uniqueId === req.query.state)
    if (index < 0) return next()
    const item = oauth2callbacks[index]
    // remove the item from the list so we don't have excess credentials in memory
    oauth2callbacks.splice(index, 1)
    item.callback(req.query.code)
    res.status(200).send('Successful authentication, you may now close this tab if it does not close automatically')
}

export default function route() {
    this.app.get('/oauthRedirect', oauthRedirect)
}

const redirectRoute = '/oauthRedirect'

export const redirectUrl = scheme() + process.env.HOSTNAME + redirectRoute

if (!process.env.HOSTNAME) {
    logger.error('HOSTNAME not set in env. Using default auth redirect url of', redirectUrl)
}
