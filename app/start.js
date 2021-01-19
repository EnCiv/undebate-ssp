"use strict";

var civilServer= require('civil-server').default
const path=require('path')
import {Iota} from "civil-server"
import iotas from '../iotas.json'

Iota.load(iotas)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
  try {
    const server = new civilServer()
    await server.earlyStart()
    server.routesDirPaths.push(path.resolve(__dirname, './routes'))
    server.socketAPIsDirPaths.push(path.resolve(__dirname, './socket-apis'))
    server.serverEventsDirPaths.push(path.resolve(__dirname, './events'))
    await server.start()
    logger.info("started")
  } catch (error) {
    logger.error('error on start', error)
  }
}

start()