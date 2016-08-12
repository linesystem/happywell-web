import crc from 'crc'
import consts from '../../constants'

let createPacket = {
  deviceInfoReq: deviceInfoReq,
  statusReq: statusReq,
  setReq: setReq
}

function addChecksum(src) {
  let buff = new Buffer(2)
  buff.writeUInt16BE(crc.crc16modbus(src), 0)
  let tmp = Buffer.concat([src, buff], src.length + 2)
  //console.log("sending packet: ========================================================")
  //console.log(tmp)
  return tmp
}

function deviceInfoReq(address) {
  let buff = new Buffer(4)
  buff.writeUInt8(consts.STX, 0)
  buff.writeUInt8(consts.CMMD.DEVICE_INFO_REQ, 1)
  buff.writeUInt8(address, 2)
  buff.writeUInt8(consts.ETX, 3)
  return addChecksum(buff)
}

function statusReq(addrLCU, addrRCU) {
  let buff = new Buffer(5)
  buff.writeUInt8(consts.STX, 0)
  buff.writeUInt8(consts.CMMD.STATUS_REQ, 1)
  buff.writeUInt8(addrLCU, 2)
  buff.writeUInt8(addrRCU, 3)
  buff.writeUInt8(consts.ETX, 4)
  return addChecksum(buff)
}

function setReq(addrLCU, addrRCU, setFlag) {
  let buff = new Buffer(15)
  buff.writeUInt8(consts.STX, 0)
  buff.writeUInt8(consts.CMMD.SET_REQ, 1)
  buff.writeUInt8(addrLCU, 2)
  buff.writeUInt8(addrRCU, 3)
  buff.writeUInt8(0xff, 4) // reserved
  buff.writeUInt8(0xff, 5) // room status
  buff.writeUInt8(0xff, 6) // set temp
  buff.writeUInt8(0xff, 7) // room sensor1
  buff.writeUInt8(0xff, 8) // room sensor2
  buff.writeUInt8(0xff, 9) // room sensor3
  buff.writeUInt8(setFlag, 10) // light setting
  buff.writeUInt8(0xff, 11) // etc
  buff.writeUInt8(0xff, 12) // air conditioner
  buff.writeUInt8(0xff, 13) // voice controller
  buff.writeUInt8(consts.ETX, 14) // voice controller
  return addChecksum(buff)
}

export default createPacket

