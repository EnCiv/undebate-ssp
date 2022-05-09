export const oauth2callbacks = []

async function googleAuthRedirect(req, res, next) {
    // this is what gets called after the user has consented to the app reading their spreadsheets
    logger.debug('stuff', req.query)
    if (!req.query.code) return next()
    if (!req.query.state) return next()
    const item = oauth2callbacks.find(obj => obj.uniqueId === req.query.state)
    if (!item) return next()
    let { tokens } = await item.oauth2Client.getToken(req.query.code)
    item.oauth2Client.setCredentials(tokens)
    item.callback()
    // todo change this to redirect otherwise the client receives the access token?
    res.sendStatus(200).end()
}

export default function route() {
    this.app.get('/googleAuthRedirect', googleAuthRedirect)
}
