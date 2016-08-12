import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import RoomSetting from '../components/setting/roomSetting'

class Setting extends Component {
  
	render() {
    const { devices, rooms, dispatch } = this.props
    return (
      <div className="row setting">
        <div className="col-md-12">
          <RoomSetting rooms={rooms} devices={devices} dispatch={dispatch} />
        </div>
      </div>
    )
  }
}

Setting.propTypes = {
  devices: PropTypes.object.isRequired,
  rooms: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { devices, rooms } = state
  return { devices, rooms }
}

export default connect(mapStateToProps)(Setting)
