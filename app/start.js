import CivilServer, { Iota, serverReactRender } from 'civil-server'
import civilIotas from 'civil-server/iotas.json'
import undebateIotas from 'undebate/iotas.json'
import iotas from '../iotas.json'
import App from './components/app'

const path = require('path')

if (serverReactRender.head) serverReactRender.head.shift() // the first on in the head didles the font size and we don't want that
Iota.load(civilIotas)
Iota.load(undebateIotas)
Iota.load(iotas) // set the initial data for the database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
    try {
        const server = new CivilServer()
        server.App = App // set the outer React wrapper for this site
        server.directives.frameSrc.push('cc.enciv.org')
        await server.earlyStart() // connect to the database, and such
        console.info('early started')
        server.routesDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/routes'))
        server.routesDirPaths.push(path.resolve(__dirname, './routes'))
        server.socketAPIsDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/socket-apis'))
        server.socketAPIsDirPaths.push(path.resolve(__dirname, './socket-apis'))
        server.serverEventsDirPaths.push(path.resolve(__dirname, '../node_modules/undebate/dist/events'))
        server.serverEventsDirPaths.push(path.resolve(__dirname, './events'))
        await server.start()
        logger.info('started')
    } catch (error) {
        console.error('error on start', error)
    }
}

start()
