import React, { Component } from 'react'
import _ from 'lodash'
import TableRow from '../tableRow'

export default class RcuList extends Component {
  render() {
    const { rooms, RCUs, addRCU, removeRCU } = this.props
    return (
      <div className="content table-responsive table-full-width">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>선택</th>
              <th>제거</th>
              <th>LCU</th>
              <th>RCU</th>
              <th>Model</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
          {
            _.map(RCUs, (RCU) => {
              let addIcon, removeIcon
              if (_.find(rooms, (room) => parseInt(room.addrLCU) == parseInt(RCU.addrLCU) && parseInt(room.addrRCU) == parseInt(RCU.addr))) {
                addIcon = ""
                removeIcon = (<i className="pe-7s-angle-right-circle" onClick={() => removeRCU(RCU.addrLCU, RCU.addr)}/>)
              } else {
                addIcon = (<i className="pe-7s-angle-left-circle" onClick={() => addRCU(RCU.addrLCU, RCU.addr)}/>)
                removeIcon = ""
              }

              return (<TableRow key={`${RCU.addrLCU}:${RCU.addr}`} values={[addIcon, removeIcon, RCU.addrLCU, RCU.addr, RCU.model, RCU.version]}/>)
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}
