import express        from 'express'
import path           from 'path'
import http           from 'http'
import cookieParser   from 'cookie-parser'
import bodyParser     from 'body-parser'
import _              from 'lodash'
import passport       from 'passport'
import api            from './api'

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(express.static(path.join(__dirname)))
app.use('/api', api)
app.get('/log', (req, res) => res.sendFile(path.join(__dirname, '../log.html')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')))

var port = normalizePort(process.env.PORT || '80')
app.set('port', port)
var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

// ======================================================================================
// split this part later
// ======================================================================================
import comm from './comm'
import db from './storage'
import consts from './constants'
import Promise from 'bluebird'
//import express from 'express'
//import http from 'http'
//import _ from 'lodash'
import socketio from 'socket.io'
import config from 'config'

var socketApp = express()
var socketServer = http.createServer(socketApp)
var io = socketio(socketServer)

// adding callback functions
comm.setCallback('packet', packetHandler)
comm.setReceiveDataCallback(receiveDataCallback)
comm.setSendDataCallback(sendDataCallback)

// initialize devices info
db.saveData("devices", {})
setPolling()

function sendDataCallback(data) {
  subscribeSockets.forEach((socket) => {
    socket.emit('log', {
      type: 'TX',
      data: data
    })
  })
}

function receiveDataCallback(data) {
  subscribeSockets.forEach((socket) => {
    socket.emit('log', {
      type: 'RX',
      data: data
    })
  })
}

function packetHandler(data) {
  switch(data.command) {
    case consts.CMMD.STATUS_RES:
      statusResponse(_.omit(data, 'command'))
      break
    case consts.CMMD.SET_RES:
      setResponse(_.omit(data, 'command'))
      break
    case consts.CMMD.DEVICE_INFO_RES:
      deviceInfoResponse(_.omit(data, 'command'))
      break
  }
}

function setResponse(data) {
  return Promise.resolve(data)
}

function statusResponse(data) {
  let id = data.addr
  db.show('status', id)
  .then((json) => {
    if (!_.isEqual(_.omit(json, 'timestamp'), data)) {
      // push to all clients
      _.forEach(sockets, (socket) => {
        console.log('emit event:', id)
        socket.emit('status', {
          id: id,
          status: data
        })
      })
    }
    data.timestamp = Date.now()
    // then save
    return db.update('status', id, data)
  })
}

function deviceInfoResponse(data) {
  let id = data.addr
  db.show('devices', id)
  .then((json) => {
    if (!_.isEqual(json, data)) {
      // merge with existing data
      data = mergeDeviceInfo(json, data)
      // push to all clients
      _.forEach(sockets, (socket) => {
        console.log('emit event:', id)
        socket.emit('devices', {
          id: id,
          device: data
        })
      })
      // then save
      return db.update('devices', id, data)
    } else {
      return
    }
  })
}

function mergeDeviceInfo(orgData, newData) {
  var dest = _.assign({}, orgData)
  dest.addr = newData.addr
  dest.id = newData.id
  dest.model = newData.model
  dest.version = newData.version
  _.forEach(newData.RCUs, (newRcu) => {
    if (dest.RCUs == undefined) { dest.RCUs = [] }
    let orgRcu = _.find(dest.RCUs, (orgRcu) => orgRcu.addr == newRcu.addr)
    if (orgRcu == undefined) {
      dest.RCUs.push(newRcu)
      return
    }
    orgRcu.addr = newRcu.addr
    orgRcu.id = newRcu.id
    orgRcu.model = newRcu.model
    orgRcu.version = newRcu.version
    orgRcu.addrLCU = newRcu.addrLCU
    _.forEach(newRcu.devices, (newDevice) => {
      if (orgRcu.devices == undefined) { orgRcu.devices = [] }
      let orgDevice = _.find(orgRcu.devices, (orgDevice) => orgDevice.addr == newDevice.addr)
      if (orgDevice == undefined) {
        orgRcu.devices.push(newDevice)
        return
      }
      orgDevice.addr = newDevice.addr
      orgDevice.id = newDevice.id
      orgDevice.model = newDevice.model
      orgDevice.version = newDevice.version
    })
  })
  return dest
}

function setPolling() {
  var polling_all = config.get('polling.all')
  var polling_device = config.get('polling.device')

  setInterval(() => {
    db.index('devices')
    .then((json) => {
      return _.values(json)
    }).each((device) => {
      var currentTime = Date.now()
      return db.show('status', device.addr)
        .then((status) => {
          // if there is no status data after last 5second, push it to client
          if ((currentTime - status.timestamp) > 5000) {
            _.forEach(sockets, (socket) => {
              socket.emit('status', {
                id: device.addr,
                status: {}
              })
            })
            return db.update('status', device.addr, { timestamp: currentTime })
              .then(() => comm.getStatus(device.addr, 0x00))
          } else {
            return comm.getStatus(device.addr, 0x00)
          }
        }).delay(polling_device)
    })
  }, polling_all)
}

// initialize socket.io server
socketServer.listen(4000, () => console.log("Socket-IO server listening at port 4000"))
var sockets = []
var subscribeSockets = []
io.on('connection', (socket) => {
  console.log('new client connected')
  sockets.push(socket)
  
  socket.on('disconnect', () => {
    console.log('Got disconnect!')
    var i = sockets.indexOf(socket)
    sockets.splice(i, 1)
    var i = subscribeSockets.indexOf(socket)
    subscribeSockets.splice(i, 1)
  })

  socket.on('subscribeLog', () => {
    console.log('subscribeLog')
    subscribeSockets.push(socket)
  })

  socket.on('unsubscribeLog', () => {
    console.log('unsubscribeLog')
    var i = subscribeSockets.indexOf(socket)
    subscribeSockets.splice(i, 1)
  })
})

export function getSockets() {
  return { sockets: sockets, subscribeSockets: subscribeSockets }
}
