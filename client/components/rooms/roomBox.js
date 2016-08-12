import React, { Component } from 'react'
import _ from 'lodash'
import LightModal from './lightModal'
import { Sortable } from 'react-sortable'

class RoomBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  openModal() {
    this.setState({isModalOpen: true})
  }

  closeModal() {
    this.setState({isModalOpen: false})
  }

  render() {
    const { className, room, status, dispatch } = this.props.children
    let bulbs = _.map(status.lightStatus || {}, (v, k) => {
      if (v == true) {
        var bg ="#FFFFFF"
        var color = "#000000"
      } else {
        var bg = "#333333"
        var color = "#FFFFFF"
      }
      return (
        <div className="bulb" key={k} style={{ backgroundColor: bg, color: color }}>
          <i className="pe-7s-light" />
        </div>
      )
    })
    if (room.name == "$") {
      return (
        <div {...this.props}>
          <div className={className}>
            <div className="roombox empty">
            </div>
          </div>
        </div>
      )
    }
    return (
      <div {...this.props}>
        <div className={className}>
          <div className="roombox" onClick={this.openModal.bind(this)}>
            <h4>{room.name}</h4>
            <h6>{room.option1}</h6>
            <h6>{room.option2}</h6>
            <h6>{room.option3}</h6>
            {bulbs}
          </div>
        </div>
        <LightModal
          dispatch={dispatch}
          room = {room}
          lightStatus={status.lightStatus}
          isOpen={this.state.isModalOpen}
          closeFunc={this.closeModal.bind(this)}
          />
      </div>
    )
  }
}

export default Sortable(RoomBox)
