import React, { Component } from 'react'
import _ from 'lodash'
import TableRow from '../tableRow'

export default class RoomList extends Component {

  render() {
    return (
      <div className="content table-responsive table-full-width room-list">
        <table ref="table" className="table table-hover table-striped">
          <thead>
            <tr>
              <th>객실명</th>
              <th>옵션1</th>
              <th>옵션2</th>
              <th>옵션3</th>
              <th>LCU</th>
              <th>RCU</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(this.props.rooms, (room) => {
                let values = []
                let removeRoom = function(id, e) {
                  e.stopPropagation()
                  this.props.removeRoom(room.id)
                }
                let style = this.props.selectedRoomId == room.id ? { backgroundColor: '#999999', color: '#FFFFFF' } : {}
                values.push((<input type="text" className="form-control" defaultValue={room.name} placeholder="객실명"/>))
                values.push((<input type="text" className="form-control" defaultValue={room.option1} placeholder="옵션1"/>))
                values.push((<input type="text" className="form-control" defaultValue={room.option2} placeholder="옵션2"/>))
                values.push((<input type="text" className="form-control" defaultValue={room.option3} placeholder="옵션3"/>))
                values.push(room.addrLCU)
                values.push(room.addrRCU)
                values.push((<i className="pe-7s-close-circle" onClick={removeRoom.bind(this, room.id)}/>))
                return (<TableRow style={style} onClick={() => this.props.clickOnRoom(room.id)} key={room.id} values={values}/>)
              })
            }
            <tr>
              <td className="add-room-row" colSpan={7} onClick={this.props.addRoom}>
                <i className="pe-7s-plus"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
