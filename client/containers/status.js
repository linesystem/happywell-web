import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import StatusTable from '../components/status/statusTable'

class Status extends Component {
  render() {
    const { status, devices } = this.props
    return (
      <div className="status">
        <div className="header">
          <h4 className="title"> Status </h4>
        </div>
        <div className="card">
          <StatusTable status={status} devices={devices} />
        </div>
      </div>
    )
  }
}

Status.propTypes = {
  status: PropTypes.object.isRequired,
  devices: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { devices, status } = state
  return { devices, status }
}

export default connect(mapStateToProps)(Status)
