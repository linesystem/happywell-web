import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import io from 'socket.io-client'
import Infinite from 'react-infinite'

const localhost = "http://" + window.location.hostname
const socket = io(localhost + ":4000", { reconnection: true })

class Log extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: []
    }
    this.stopSubscribe = this.stopSubscribe.bind(this)
    this.startSubscribe = this.startSubscribe.bind(this)
  }

  stopSubscribe() {
    socket.emit('unsubscribeLog')
    this.setState({subscribe: false})
  }

  startSubscribe() {
    socket.emit('subscribeLog')
    this.setState({subscribe: true})
  }

  componentDidMount() {
    this.startSubscribe()

    // socketio data update
    socket.on('log', (data) => {
      var view = new Uint8Array(data.data)
      this.setState({
        logs: this.state.logs.concat( [ {
          type: data.type,
          data: _.map(view, (ch) => _.padStart(ch.toString(16), 2, "0")).join("-")
        } ] )
      })
    })
  }

  render() {
    return (
      <div className="log">
        <nav className="navbar navbar-default navbar-fixed-top">
          <button className="btn btn-primary-outline btn-sm" onClick={this.state.subscribe ? this.stopSubscribe : this.startSubscribe}>
            {this.state.subscribe ? "STOP" : "START" }
          </button>
        </nav>
        <div className="content">
          <div className="card">
            <Infinite
              containerHeight={510}
              elementHeight={42}
              displayBottomUpwards>
            { _.map(this.state.logs, (log, i) => {
              return (<p key={i} className="log-line">{log.type + " : "  + log.data}</p>)
            })}
            </Infinite>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Log />,
  document.getElementById('root')
)
