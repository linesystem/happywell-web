import db from '../storage'
import _ from 'lodash'
import comm from '../comm'
import  { getSockets } from '../app'
var devices = {
  index: index,
  reload: reload,
  reset: reset
}

function index(req, res) {
  db.index('devices')  
  .then(json => res.send(json))
}

function reload(req, res) {
  if (!comm.portConnected()) {
    return res.send({})
  }
  return comm.getDeviceInfo()
    .then(() => res.send({}))
}

function reset(req, res) {
  let sockets = getSockets().sockets
  db.saveData('devices', {})
  .then(() => {
    return _.forEach(sockets, (socket) => {
      console.log('initialize devices info')
      socket.emit('devices', {
        id: 0,
        device: {}
      })
    })
  }).then(() => {
    if (!comm.portConnected()) {
      return
    }
    return comm.getDeviceInfo()
  }).then(() => res.send({}))
}

export default devices
