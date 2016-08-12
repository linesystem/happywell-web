const constants = {
  STX: 0x5b,
  ETX: 0x5d,
  CMMD: {
    STATUS_REQ: 0x03,
    STATUS_RES: 0x04,
    SET_REQ: 0x05,
    SET_RES: 0x06,
    INIT_REQ: 0x07,
    DEVICE_INFO_REQ: 0x2b,
    DEVICE_INFO_RES: 0x2c
  },
  ROOM_STATUS: [
    "" ,
    "READY",
    "OCCUPIED",
    "OUT",
    "LEAVE",
    "CLEANING",
    "EMPTY",
    "RESERVED",
    "MAINTENANCE"
  ],
  ROOM_SENSOR_1: {
  },
  ROOM_SENSOR_2: {
  },
  ROOM_SENSOR_3: {
  },
  LIGHT_STATUS: {
    MAIN: 0x01,
    MOOD: 0x02,
    BATH: 0x04,
    SUB1: 0x08,
    SUB2: 0x10,
    SUB3: 0x20,
    SUB4: 0x40
  },
  COMM_STATUS_1: {
    KEY_HOLDER: 0x01,
    CHIME_BELL: 0x02,
    ROOM_NO: 0x04,
    LIGHT_TABLE: 0x08,
    SW_6S: 0x10,
    SW_3S: 0x20,
    SW_1S: 0x40,
    RCU: 0x80
  },
  COMM_STATUS_2: {
    AIR_COND: 0x01,
    FAN_COIL: 0x02,
    EXIT_SW: 0x04,
    VOICE_TERMINAL: 0x08,
    AIR_CHCKER: 0x10
  },
  UPDATE_FLAG: {
    DEFAULT: 0x00,
    UPDATED: 0x01,
    RESET: 0x02
  }
}
export default constants
