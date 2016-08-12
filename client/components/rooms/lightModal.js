import React, { Component } from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import { putData } from '../../actions'


export default class LightModal extends Component {
  toggleLight(key, value) {
    const { room, dispatch } = this.props
    let body = {
      LCU: room.addrLCU,
      RCU: room.addrRCU,
      lightStatus: {
      }
    }
    body.lightStatus[key] = value
    dispatch(putData('/status', body))
  }
  render() {
		const { room, lightStatus, dispatch, isOpen, closeFunc } = this.props
    var i = 0
    let bulbs = _.map(lightStatus || {}, (v, k) => {
			let toggle = this.toggleLight.bind(this, k, !v)
      if (v == true) {
        var bg ="#FFFFFF"
        var color = "#000000"
      } else {
        var bg = "#333333"
        var color = "#FFFFFF"
      }
      i = i + 1
      return (
        <div className="bulb" key={k} style={{ backgroundColor: bg, color: color }} onClick={toggle}>
          <i className="pe-7s-light" />
          <p>{i}</p>
        </div>
      )
    })
    return (
      <Modal className="modal-dialog light-modal" closeTimeoutMS={150} isOpen={isOpen}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={closeFunc}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">{room.name}</h4>
            <h6>{room.option1}</h6>
            <h6>{room.option2}</h6>
            <h6>{room.option3}</h6>
          </div>
          <div className="modal-body">
            {bulbs}
          </div>
        </div>
      </Modal>
    )
  }
}
