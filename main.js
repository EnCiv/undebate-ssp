"use strict";

import civilServer from 'civil-server'
import path from 'path'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
  try {
    const server = new civilServer()
    await server.earlyStart()
    await server.addRoutesDirectory(path.resolve(__dirname, './routes'))
    await server.addSocketAPIsDirectory(path.resolve(__dirname, './socket-api'))
    server.addEventsDirectory(path.resolve(__dirname, './events')) // don't await this on
    await server.start()
    logger.info("started")
  } catch (error) {
    logger.error('error on start', error)
  }
}

start()