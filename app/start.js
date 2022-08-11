import CivilServer, { Iota, serverReactRender } from 'civil-server'
import civilIotas from 'civil-server/iotas.json'
import undebateIotas from 'undebate/iotas.json'
import iotas from '../iotas.json'
import App from './components/app'
import scheme from './lib/scheme'

const path = require('path')

Iota.load(civilIotas)
Iota.load(undebateIotas)
Iota.load(iotas) // set the initial data for the database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
    try {
        const server = new CivilServer()
        server.App = App // set the outer React wrapper for this site
        server.directives.frameSrc.push('cc.enciv.org')
        server.directives.frameSrc.push(scheme() + process.env.HOSTNAME)
        await server.earlyStart() // connect to the database, and such
        server.routesDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/routes'))
        server.routesDirPaths.push(path.resolve(__dirname, './routes'))
        server.socketAPIsDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/socket-apis'))
        server.socketAPIsDirPaths.push(path.resolve(__dirname, './socket-apis'))
        server.serverEventsDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/events'))
        server.serverEventsDirPaths.push(path.resolve(__dirname, './events'))
        await server.start()
        logger.info('started')
    } catch (error) {
        logger.error('error on start', error)
    }
}

start()
