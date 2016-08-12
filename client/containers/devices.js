import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { postData } from '../actions'
import DevicesTable from '../components/devices/devicesTable'

class Devices extends Component {
  render() {
    const { dispatch } = this.props
    return (
      <div className="devices">
        <div className="header">
          <div className="header-left pull-left">
            <h4 className="title"> Device List </h4>
          </div>
          <div className="header-right pull-right">
            <button className="btn btn-primary-outline btn-sm" onClick={() => dispatch(postData('/devices/reset', {}))}>
              검  색
            </button>
            <button className="btn btn-primary-outline btn-sm" onClick={() => dispatch(postData('/devices/reload', {}))}>
              중복검색
            </button>
          </div>
        </div>
        <div className="card">
          <DevicesTable devices={this.props.devices} />
        </div>
      </div>
    )
  }
}

Devices.propTypes = {
  devices: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { devices } = state
  return { devices }
}

export default connect(mapStateToProps)(Devices)
