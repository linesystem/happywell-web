import serialPort, { SerialPort }  from 'serialport'
import Promise from 'bluebird'
import createPacket from './createPacket'
import parsePacket from './parsePacket'
import consts from '../constants'
import _ from 'lodash'
var listAsync = Promise.promisify(serialPort.list)

let Comm = class {
  constructor() {
    this.eventParser = eventParser.bind(this)
    this.buff = new Buffer(4096)
    this.buffLength = 0
    this.offsetETX = 0
    this.sendData = this.sendData.bind(this)
    this.callbacks = []
  }

  sendData(data) {
    if (!this.portConnected()) {
      return Promise.resolve()
    }
    return this.portAsync.writeAsync(data)
    .then(() => {
      if (this.sendDataCallback != undefined) {
        return this.sendDataCallback(data)
      }
      return
    })
  }

  getPorts() {
    return listAsync()
  }

  portConnected() {
    return this.port
  }

  connectPort(name, baudrate) {
    if (!baudrate) {
      baudrate = 115200
    }
    function closePort(port) {
      if (port) {
        console.log("trying to close port")
        return port.closeAsync()
      }
      console.log("just skip")
      return Promise.resolve()
    }
    return closePort(this.portAsync)
      .bind(this)
      .then(() => {
        this.port = new SerialPort(name, { parser: this.eventParser, baudrate: baudrate }, false)
        this.portAsync = Promise.promisifyAll(this.port)
        this.port.on('error', (error) => console.log(`error:${error}`))
        this.port.on('close', () => {
          console.log('port closed')
          this.port = undefined
          this.portAsync = undefined
        })
        this.port.on('disconnect', (error) => {
          console.log('port disconnected')
          this.port = undefined
          this.portAsync = undefined
        })
      }).then(() => { return this.portAsync.openAsync() })
      .then(() => {
        console.log("port opened", name)
        return this.callbacks.forEach((callback) => {
          console.log(callback)
          this.port.on(callback.name, callback.cb)
        })
      }).then(() => true)
      .catch((e) => {
        console.log("failed to connect port")
        console.log(e)
        return false
      })
  }

  setCallback(eventName, cb) {
    this.callbacks.push({ name: eventName, cb: cb })
    if (this.port) {
      this.port.on(eventName, cb)
    }
  }

  setSendDataCallback(cb) {
    this.sendDataCallback = cb
  }
  setReceiveDataCallback(cb) {
    this.receiveDataCallback = cb
  }

  getDeviceInfo() {
    function loop(exec, start, end) {
      if (start < end) {
        exec(start)
        .then(() => loop(exec, ++start, end))
      } else {
        return Promise.resolve()
      }
    }
    return this.sendData(createPacket.deviceInfoReq(0xFF)).bind(this)
    .delay(1000)
    .then(loop((index) => {
        return this.sendData(createPacket.deviceInfoReq(index))
        .delay(1000)
      }, 0x00, 0x08)
    )
  }

  getStatus(addrLCU, addrRCU) {
    return this.sendData(createPacket.statusReq(addrLCU, addrRCU))
  }

  setStatus(addrLCU, addrRCU, status) {
    let setFlag = 0x00
    _.forEach(status, (v, k) => {
      if (v == true) {
        setFlag = setFlag | consts.LIGHT_STATUS[k.toUpperCase()]
      } else {
        setFlag = setFlag & ~consts.LIGHT_STATUS[k.toUpperCase()]
      }
    })
    return this.sendData(createPacket.setReq(addrLCU, addrRCU, setFlag))
  }
}

function eventParser(emitter, data) {
  for (var i = 0; i < data.length; i++) {
    switch(data[i]) {
      case consts.STX:
        this.buff.fill(0)
        this.buffLength = 0
        break
      case consts.ETX:
        this.offsetETX += 1
        break
      default:
        if (this.offsetETX > 0) {
          this.offsetETX += 1
        }
        break
    }
    this.buff[this.buffLength] = data[i]
    this.buffLength += 1
    // 2byte after etx
    if (this.offsetETX == 3) {
      let packet = new Buffer(this.buffLength)
      this.buff.copy(packet, 0, 0, this.buffLength)
      let parsedData = parsePacket(packet)
      if (parsedData != null) {
        parsedData.command = packet[1]
        emitter.emit("packet", parsedData)
      }
      if (this.receiveDataCallback != undefined) {
        this.receiveDataCallback(packet)
      }
      this.offsetETX = 0
      this.buff.fill(0)
      this.buffLength = 0
    }
  }
}
export default Comm
