'use strict'

const civilServer = require('civil-server').default
const path = require('path')
import { Iota } from 'civil-server'
import civilIotas from '../node_modules/civil-server/iotas.json'
import undebateIotas from '../node_modules/undebate/iotas.json'
import iotas from '../iotas.json'
import App from './components/app'

Iota.load(civilIotas)
Iota.load(undebateIotas)
Iota.load(iotas) // set the initial data for the database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const start = async () => {
    try {
        const server = new civilServer()
        server.App = App // set the outer React wrapper for this site
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
