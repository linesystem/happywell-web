import React, { Component } from 'react'
import _ from 'lodash'
import TableRow from '../tableRow'

export default class DevicesTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flipItems: []
    }
    this.flipItem = this.flipItem.bind(this)
    this.flipAll = this.flipAll.bind(this)
  }

  flipItem(item) {
    let { flipItems } = this.state
    let index = flipItems.indexOf(item)
    if (index < 0)  {
      flipItems = flipItems.concat([item])
    } else {
      flipItems.splice(index, 1)
    }
    this.setState({flipItems: flipItems})
  }

  flipAll() {
    let { flipItems } = this.state
    const { devices } = this.props
    let newList = []
    if (_.isEmpty(flipItems)) {
      _.forEach(devices, (LCU) => {
        newList.push(`${LCU.addr}:-`)
        _.forEach(LCU.RCUs, (RCU) => newList.push(`${LCU.addr}:${RCU.addr}`))
      })
    }
    this.setState({flipItems: newList})
  }

  render() {
    const { devices } = this.props
    const { flipItems } = this.state
    let arr = []
    _.forEach(devices, (LCU, k) => {
      let i = flipItems.indexOf(`${LCU.addr}:-`)
      let icon = i < 0 ? (<i className="pe-7s-less" onClick={() => this.flipItem(`${LCU.addr}:-`)} />) : (<i className="pe-7s-plus" onClick={() => this.flipItem(`${LCU.addr}:-`)} />)
      arr.push(<TableRow key={`${LCU.addr}:-:-`} values={[icon, LCU.addr, "-", "-", LCU.id, LCU.model, LCU.version]} />)
      if (i >= 0) { return }
      _.forEach(LCU.RCUs, (RCU) => {
        let i = flipItems.indexOf(`${LCU.addr}:${RCU.addr}`)
        let icon = i < 0 ? (<i className="pe-7s-less" onClick={() => this.flipItem(`${LCU.addr}:${RCU.addr}`)} />) : (<i className="pe-7s-plus" onClick={() => this.flipItem(`${LCU.addr}:${RCU.addr}`)} />)
        arr.push(<TableRow key={`${LCU.addr}:${RCU.addr}:-`} values={[icon, LCU.addr, RCU.addr, "-", RCU.id, RCU.model, RCU.version]} />)
        if (i >= 0) { return }
        _.forEach(RCU.devices, (device) => {
          arr.push(<TableRow key={`${LCU.addr}:${RCU.addr}:${device.addr}`}  values={["", LCU.addr, RCU.addr, device.addr, device.id, device.model, device.version]} />)
        })
      })
    })

    let headerIcon = _.isEmpty(this.state.flipItems) ? 
      (<i className="pe-7s-less" onClick={this.flipAll} />) :
      (<i className="pe-7s-plus" onClick={this.flipAll} />)
    return (
      <div className="content table-responsive table-full-width">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>{headerIcon}</th>
              <th>LCU</th>
              <th>RCU</th>
              <th>Device</th>
              <th>ID</th>
              <th>Model</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
          { arr }
          </tbody>
        </table>
      </div>
    )
  }
}
