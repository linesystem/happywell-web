import React, { Component } from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import { postData } from '../actions'
import Select from 'react-select'

const baudRates = [
  { value: 9600, label: "9600" },
  { value: 14400, label: "14400" },
  { value: 19200, label: "19200" },
  { value: 38400, label: "38400" },
  { value: 57600, label: "57600" },
  { value: 115200, label: "115200" }
]

export default class CommModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baudRate: 115200,
      port: ""
    }
  }
  setBaudRate(val) {
    this.setState({ baudRate: val.value })
  }
  setPort(val) {
    this.setState({ port: val.value })
  }

	connectPort() {
    const { dispatch, closeFunc } = this.props
    var body = {
      baudRate: this.state.baudRate,
      port: this.state.port
    }
    dispatch(postData('/ports/connect', body))
    closeFunc()
	}
  render() {
		const { ports, isOpen, closeFunc } = this.props
    const portOptions = _.map(ports, (port) => {
      return { value: port.comName, label: port.comName }
    })
    return (

      <Modal className="modal-dialog comm-setting" closeTimeoutMS={150} isOpen={isOpen}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={closeFunc}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">통신설정</h4>
          </div>
          <div className="modal-body">
            <div className="inputs">
              <ul>
                <li>
                  <label>통신포트</label>
                  <Select 
										name="ports"
										value={this.state.port}
										options={portOptions}
										onChange={this.setPort.bind(this)}
                    className="ports"
                    clearable={false}
                  />
                </li>
                <li>
                  <label>Baud Rate</label>
                  <Select 
										name="baud-rates"
										value={this.state.baudRate}
										options={baudRates}
										onChange={this.setBaudRate.bind(this)}
                    className="baud-rate"
                    clearable={false}
                  />
                </li>
              </ul>
            </div>
            <div className="summit">
              <button className="btn btn-primary-outline btn-sm" onClick={this.connectPort.bind(this)}>
								적  용
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
