import React, { Component } from 'react'
import _ from 'lodash'
import TableRow from '../tableRow'

export default class StatusTable extends Component {
  render() {
    const { devices, status } = this.props
    let list = []
    _.forEach(devices, (lcu) => {
        let values = [
          lcu.addr,
          "-",
           (<div className={status[lcu.addr] == undefined || _.isEmpty(status[lcu.addr]) ? "circle red" : "circle green"} />),
          "",
          "",
          "",
          ""
        ]
        list.push((<TableRow key={`${lcu.addr}:-`} values={values}/>))
      _.forEach(lcu.RCUs, (rcu) => {
        let rcuStatus

        if (status[lcu.addr] == undefined) {
          rcuStatus = undefined
        } else {
          rcuStatus = _.find(status[lcu.addr].RCUs, (rcuStatus) => rcuStatus.addr == rcu.addr)
        }

        if (rcuStatus == undefined) {
          var commStatus = {
            LCU: false,
            RCU: false,
            lightTable: false,
            sw_6s: false,
            sw_3s: false,
            sw_1s: false
          }
        } else {
          var commStatus = rcuStatus.commStatus
        }

        let values = [
          lcu.addr,
          rcu.addr,
          "",
          (<div className={commStatus.RCU ? "circle green" : "circle red"} />),
          (<div className={commStatus.RCU && commStatus.sw_6s ? "circle green" : "circle red"} />),
          (<div className={commStatus.RCU && commStatus.sw_3s ? "circle green" : "circle red"} />),
          (<div className={commStatus.RCU && commStatus.sw_1s ? "circle green" : "circle red"} />)
        ]
        list.push((<TableRow key={`${lcu.addr}:${rcu.addr}`} values={values}/>))
      })
    })
    return (
      <div className="content table-responsive table-full-width">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>LCU</th>
              <th>RCU</th>
              <th>LCU</th>
              <th>RCU</th>
              <th>6S</th>
              <th>3S</th>
              <th>1S</th>
            </tr>
          </thead>
          <tbody>
          { list }
          </tbody>
        </table>
      </div>
    )
  }
}
