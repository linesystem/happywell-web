import db from '../storage'
import _ from 'lodash'
import comm from '../comm'

var ports = {
  index: index,
  connect: connect,
}

function index(req, res) {
  comm.getPorts()
  .then((ports) => {
    ports = _.reject(ports, (port) => !port.manufacturer && !port.serialNumber)
    let portConnected = comm.portConnected()
    if (portConnected) {
      ports.forEach((port) => {
        if (port.comName == portConnected.path) {
          port.connected = true
        }
      })
    }
    return res.send(ports)
  })
}

function connect(req, res) {
  comm.connectPort(req.body.port, req.body.baudRate)
  .then((result) => {
    if (result == false) {
      return res.send({result: 'failed'})
    }
    return comm.getDeviceInfo()
      .then(() => res.send({result: 'success'}))
  })
}

export default ports
