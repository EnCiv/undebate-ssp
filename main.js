"use strict";

var civilServer= require('civil-server')
const path=require('path')

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