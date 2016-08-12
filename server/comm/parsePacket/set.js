import consts from '../../constants'

export function setReq(packet) {
}

export function setRes(packet) {
  let addrLCU = packet.readUInt8(2)
  let addrRCU = packet.readUInt8(3)
  let ack = packet.readUInt8(4)
  let error = packet.readUInt8(5)
  return {
    addrLCU: addrLCU,
    addrRCU: addrRCU,
    ack: ack.toString(16),
    error: error.toString(16)
  }
}
