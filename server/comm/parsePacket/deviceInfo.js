import consts from '../../constants'
import crc from 'crc'

export function deviceInfoReq(packet) {
}

export function deviceInfoRes(packet) {
  let addrLCU = packet.readUInt8(2)
  let nRCU = packet.readUInt8(3)
  let infoLCU = deviceInfo(packet.slice(4, 12))
  infoLCU.addr = addrLCU
  let indexRCU = 12
  infoLCU.RCUs = []
  for (var i = 0; i < nRCU; i++) {
    let addrRCU = packet.readUInt8(indexRCU)
    let nDevice = packet.readUInt8(indexRCU+1)
    let infoDevices = []
    let offset = 2
    for (var j = 0; j < nDevice; j++) {
      let infoDevice = deviceInfo(packet.slice(indexRCU+offset, indexRCU+8+offset))
      infoDevices.push(infoDevice)
      offset += 8
    }
    if (infoDevices.length != 0) {
      let infoRCU = infoDevices.shift()
      infoRCU.addr = addrRCU
      infoRCU.addrLCU = addrLCU
      infoRCU.devices = infoDevices
      infoLCU.RCUs.push(infoRCU)
    }
    indexRCU += offset
  }
  return infoLCU
}

function deviceInfo(data) {
  return {
    addr: data.readUInt8(0),
    id: data.toString('ascii', 1, 3),
    model: data.toString('ascii', 3, 6),
    version: getVersion(data.slice(6, 8))
  }
}

function getVersion(data) {
  let major = data.readUInt8(0) >> 4 // first 4 bit
  let minor = data.readUInt8(0) & 15 // second 4 bit
  let patch = data.readUInt8(1) // last 8bit
  return `${major}.${minor}.${patch}`
}
