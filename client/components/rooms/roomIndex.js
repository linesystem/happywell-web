import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import RoomBox from './roomBox'

export default class RoomIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      draggingIndex: null,
      data: this.propsToArray(props)
    }
    this.updateState = this.updateState.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: this.propsToArray(nextProps)})
  }

  updateState(obj) {
    this.setState(obj)
  }

  propsToArray(props) {
    const { colCount, rowCount, roomIndex, rooms } = props
    return _.chain(roomIndex)
      .values()
      .union(_.map(rooms, 'uniqKey'))
      .uniq()
      .compact()
      .value()
  }


  render() {
    const { colCount, rowCount, rooms, status, dispatch } = this.props
    let className = `col-xs-${12/colCount} row-${rowCount}`
    var list = _.map(this.state.data, (uniqKey, i) => {
      let room = _.find(rooms, (room) => room.uniqKey == uniqKey)
      if (!room) { return }
      let rcu = {}
      if (status[room.addrLCU] != undefined) {
        rcu = _.find(status[room.addrLCU].RCUs, (rcu) => rcu.addr == room.addrRCU )
      }
      return (
        <RoomBox
          key={i}
          updateState={this.updateState}
          items={this.state.data}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list">
          {{
            className: className,
            room: room,
            status: rcu,
            dispatch: dispatch
          }}
        </RoomBox>
      )
    })
    list = _.compact(list)
    var listWithColumn = []
    for (let i = 0; i < list.length / colCount; i++) {
      listWithColumn.push((
        <div className="row" key={i}>
          {_.slice(list, i*colCount, i*colCount + colCount)}
        </div>
      ))
    } 

    return (
      <div className="container-fluid room-index">
        {listWithColumn}
      </div>
    )
  }
}
