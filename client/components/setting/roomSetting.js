import React, { Component } from 'react'
import _ from 'lodash'
import RcuList from './rcuList'
import RoomList from './roomList'
import { putData } from '../../actions'

export default class RoomSetting extends Component {
  constructor(props) {
    super(props)
    this.refreshRoomList = this.refreshRoomList.bind(this)
    this.clickOnRoom = this.clickOnRoom.bind(this)
    this.addRCU = this.addRCU.bind(this)
    this.removeRCU = this.removeRCU.bind(this)
    this.addRoom = this.addRoom.bind(this)
    this.removeRoom = this.removeRoom.bind(this)
    this.state = {
      selectedRoomId: undefined
    }
  }

  componentWillMount() {
    this.refreshRoomList(this.props.rooms)
  }

  // refresh Roomlist when state is changed
  componentWillReceiveProps(nextProps) {
    this.refreshRoomList(nextProps.rooms)
  }

  clickOnRoom(id) {
    if (this.state.selectedRoomId == id) {
      this.setState({ selectedRoomId: undefined })
    } else {
      this.setState({ selectedRoomId: id })
    }
  }

  addRCU(addrLCU, addrRCU) {
    if (this.state.selectedRoomId == undefined) {
      return
    }
    this.removeRCU(addrLCU, addrRCU)
    let roomList = this.state.roomList
    roomList[this.state.selectedRoomId-1].addrLCU = addrLCU
    roomList[this.state.selectedRoomId-1].addrRCU = addrRCU
    this.setState({ roomList: roomList })
  }

  removeRCU(addrLCU, addrRCU) {
    let roomList = this.state.roomList
    let i = _.findIndex(roomList, (room) => parseInt(room.addrLCU) == parseInt(addrLCU) && parseInt(room.addrRCU) == parseInt(addrRCU) )
    if (i >= 0) {
      roomList[i].addrLCU = ""
      roomList[i].addrRCU = ""
      this.setState({ roomList: roomList })
    }
  }
 
  refreshRoomList(rooms) {
    let i = 0
    let roomList = _.map(rooms, (room) => {
      i = i + 1
      room.id = i
      return _.assign({}, room)
    })
    this.setState({ roomList: roomList, selectedRoomId: undefined })
  }

  addRoom() {
    let id = (_.maxBy(this.state.roomList, "id") || {id: 0}).id + 1
    let roomList = _.concat(this.state.roomList, [{
      id: id,
      name: "",
      option1: "",
      option2: "",
      addrLCU: "",
      addrRCU: ""
    }])
    this.setState({ roomList: roomList })
  }

  removeRoom(id) {
    let roomList = _.reject(this.state.roomList, (room) => room.id == id)
    this.setState({ roomList: roomList })
  }

  // send updated data to server
  updateRooms() {
    const { dispatch } = this.props
    let data = {}
    _.forEach(this.refs.roomList.refs.table.rows, (row, i) => {
      // skip first and last row
      if (i == 0 || row.cells[0].childNodes[0].value == undefined) {
        return
      }

      let name = row.cells[0].childNodes[0].value
      let option1 = row.cells[1].childNodes[0].value
      let option2 = row.cells[2].childNodes[0].value
      let option3 = row.cells[3].childNodes[0].value

      // skip if there is no information
      if (name == "" && option1 == "" && option2 == "" && option3 == "") {
        return
      }
      data[i] = {
        id: i,
        name: name,
        option1: option1,
        option2: option2,
        option3: option3,
        addrLCU: row.cells[4].innerHTML,
        addrRCU: row.cells[5].innerHTML
      }
    })
    //let names = _.chain(data).map('name').uniq().value()
    //if (names.length != _.keys(data).length) {
    //  return alert("중복된 이름이 있습니다!")
    //}
    dispatch(putData('/rooms', data))
  }

  render() {
    const { devices } = this.props
    let RCUs = []
    _.forEach(devices, (v, k) => {
      RCUs = RCUs.concat(v.RCUs)
    })
    let roomList
    return (
      <div className="room-setting">
        <div className="row header">
          <div className='title'>
            <h4>객실등록</h4>
          </div>
          <div className='buttons'>
            <button type="button" className="btn btn-primary-outline btn-sm" onClick={() => this.refreshRoomList(this.props.rooms)}>불러오기</button>
            <button type="button" className="btn btn-primary-outline btn-sm" onClick={this.updateRooms.bind(this)}>저장</button>
          </div>
        </div>
        <div className="row">
          <div className='col-md-6'>
            <div className='card'>
              <RoomList ref="roomList" selectedRoomId={this.state.selectedRoomId} rooms={this.state.roomList} clickOnRoom={this.clickOnRoom} addRoom={this.addRoom} removeRoom={this.removeRoom} />
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card'>
              <RcuList rooms={this.state.roomList} addRCU={this.addRCU} removeRCU={this.removeRCU} RCUs={RCUs} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
