import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { putData } from '../actions'
import RoomIndex from '../components/rooms/roomIndex'

class Rooms extends Component {
  render() {
    const { users, roomIndex, rooms, status, dispatch } = this.props
    return (
      <div className="rooms">
        <div className="header">
          <div className="header-left pull-left">
            <h4 className="title">Main</h4>
          </div>
          <div className="header-right pull-right">
            <button className="btn btn-primary-outline btn-sm" onClick={() => dispatch(putData('/room-index', _.compact(this.refs.roomIndex.state.data)))}>
              배치저장
            </button>
          </div>
        </div>
        <div className="card">
          <RoomIndex ref="roomIndex" colCount={users.colCount || 4} rowCount={users.rowCount || 5} roomIndex={roomIndex} rooms={rooms} status={status} dispatch={dispatch} />
        </div>
      </div>
    )
  }
}

Rooms.propTypes = {
  users: PropTypes.object.isRequired,
  rooms: PropTypes.object.isRequired,
  roomIndex: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { users, status, rooms, roomIndex } = state
  return { users, status, rooms, roomIndex }
}

export default connect(mapStateToProps)(Rooms)
