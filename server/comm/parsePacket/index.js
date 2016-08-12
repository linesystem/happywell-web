import consts from '../../constants'
import crc from 'crc'
import { deviceInfoRes, deviceInfoReq } from './deviceInfo'
import { statusRes, statusReq } from './status'
import { setRes, setReq } from './set'
export { statusRes }

let parsePacket = function(packet) {

  if (checkChecksum(packet) == false) {
    console.log("checksum failed: ========================================================", packet)
    console.log("length:", packet.length)
    return
  }

  let parsedPacket

  //parse packet based on command
  switch(packet[1]) {
    case consts.CMMD.STATUS_RES:
      parsedPacket = statusRes(packet)
      break
    case consts.CMMD.SET_RES:
      parsedPacket = setRes(packet)
      break
    case consts.CMMD.DEVICE_INFO_RES:
      parsedPacket = deviceInfoRes(packet)
      break
    default:
      console.log("undefined command")
      console.log(packet)
      parsedPacket = null
      break
  }
  return parsedPacket
}

function checkChecksum(packet) {
  let checksumFromPacket = packet.readUInt16BE(packet.length-2)
  let checksum = crc.crc16modbus(packet.slice(0, packet.length-2))
  if (checksumFromPacket == checksum) {
    return true
  }
  return false
}

export default parsePacket
