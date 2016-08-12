import consts from '../../constants'

export function statusReq(packet) {
}

export function statusRes(packet) {
  let RCUs = []
  let addrLCU = packet.readUInt8(2)
  let nRCU = packet.readUInt8(3)
  let offset = 5
  for (var i = 0; i < nRCU; i++) {
    let status = statusRCU(packet.slice(offset, offset+13))
    if (status != null) {
      RCUs.push(status)
    }
    offset += 13
  }
  return {
    addr: addrLCU,
    RCUs: RCUs
  }
}

function statusRCU(data) {
  if (data.length == 0) {
    return null
  }
  let addrRCU = data.readUInt8(0)
  if (addrRCU == 0 || addrRCU == consts.ETX) {
    return null 
  }
  let lightStatus = data.readUInt8(7)
  let commStatus1 = data.readUInt8(10)
  let commStatus2 = data.readUInt8(11)
  let updateFlag  = data.readUInt8(12)
  return {
    addr: addrRCU,
    roomStatus: consts.ROOM_STATUS[data.readUInt8(1)],
    temp: data.readInt8(2),
    setTemp: data.readInt8(3),
    // implement later
    // roomSensor1: {},
    // roomSensor2: {},
    // roomSensor3: {},
    lightStatus: {
      main: Boolean(consts.LIGHT_STATUS.MAIN & lightStatus),
      mood: Boolean(consts.LIGHT_STATUS.MOOD & lightStatus),
      bath: Boolean(consts.LIGHT_STATUS.BATH & lightStatus),
      sub1: Boolean(consts.LIGHT_STATUS.SUB1 & lightStatus),
      sub2: Boolean(consts.LIGHT_STATUS.SUB2 & lightStatus),
      sub3: Boolean(consts.LIGHT_STATUS.SUB3 & lightStatus)
    },
    commStatus: {
      //keyHolder:    Boolean(consts.COMM_STATUS_1.KEY_HOLDER & commStatus1),
      //chimeBell:    Boolean(consts.COMM_STATUS_1.CHIME_BELL & commStatus1),
      //roomNo:       Boolean(consts.COMM_STATUS_1.ROOM_NO & commStatus1),
      lightTable:   !Boolean(consts.COMM_STATUS_1.LIGHT_TABLE & commStatus1),
      sw_6s:        !Boolean(consts.COMM_STATUS_1.SW_6S & commStatus1),
      sw_3s:        !Boolean(consts.COMM_STATUS_1.SW_3S & commStatus1),
      sw_1s:        !Boolean(consts.COMM_STATUS_1.SW_1S & commStatus1),
      RCU:          !Boolean(consts.COMM_STATUS_1.RCU & commStatus1)
      //airCond:      Boolean(consts.COMM_STATUS_2.AIR_COND & commStatus2),
      //fanCoil:      Boolean(consts.COMM_STATUS_2.FAN_COIL & commStatus2),
      //exitSW:       Boolean(consts.COMM_STATUS_2.EXIT_SW & commStatus2),
      //voiceTerminal:Boolean(consts.COMM_STATUS_2.VOICE_TERMINAL & commStatus2),
      //airChecker:   Boolean(consts.COMM_STATUS_2.AIR_CHECKER & commStatus2)
    },
    updateFlag: updateFlag
  }

}
