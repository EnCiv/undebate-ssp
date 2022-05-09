export const oauth2callbacks = []

async function googleAuthRedirect(req, res, next) {
    // this is what gets called after the user has consented to the app reading their spreadsheets
    logger.debug('stuff', req.query)
    if (!req.query.code) return next()
    if (!req.query.state) return next()

    const index = oauth2callbacks.findIndex(obj => obj.uniqueId === req.query.state)
    if (index < 0) return next()
    const item = oauth2callbacks[index]

    let { tokens } = await item.oauth2Client.getToken(req.query.code)
    item.oauth2Client.setCredentials(tokens)
    item.callback()

    // remove the item from the list so we don't have excess credentials in memory
    oauth2callbacks.splice(index, 1)

    // todo change this to redirect otherwise the client receives the access token?
    res.sendStatus(200).end()
}

export default function route() {
    this.app.get('/googleAuthRedirect', googleAuthRedirect)
}
