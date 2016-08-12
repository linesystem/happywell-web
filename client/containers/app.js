import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import io from 'socket.io-client'

import { socketStatus, socketDevices } from '../actions'
import { getData, putData, postData, signOut } from '../actions'
import SideBar from '../components/sidebar'
import NaviBar from '../components/naviBar'
import FooterBar from '../components/footerBar'

const localhost = "http://" + window.location.hostname
const socket = io(localhost + ":4000", { reconnection: true })
class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    // initial data load
    dispatch(getData('/devices'))
    dispatch(getData('/status'))
    dispatch(getData('/rooms'))
    dispatch(getData('/room-index'))
    dispatch(getData('/ports'))
    dispatch(getData('/users'))

    // socketio data update
    socket.on('status', (data) => {
      console.log("status event emitted:", data)
      return dispatch(socketStatus(data))
    })

    socket.on('devices', (data) => {
      console.log("devices event emitted:", data)
      return dispatch(socketDevices(data))
    })
  }
  onClickSignOut() {
    const { dispatch } = this.props
    dispatch(signOut())
  }

  render() {
    const { users, location, children, dispatch, ports } = this.props
    return (
      <div className="wrapper">
        <SideBar/>
        <div className="main-panel">
          <NaviBar signOut={this.onClickSignOut.bind(this)} />
          <div className="content">
            <div className="container-fluid">
            {children}
            </div>
          </div>
          <FooterBar users={users} ports={ports} dispatch={dispatch} path={location.pathname}/>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  users: PropTypes.object.isRequired,
  ports: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { ports, users } = state
  return { ports, users }
}

export default connect(mapStateToProps)(App)
