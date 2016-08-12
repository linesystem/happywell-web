import db from '../storage'
import comm from '../comm'
import _ from 'lodash'
var status = {
  index: index,
	update: update
}

function index(req, res) {
  db.index('status')
  .then(json => res.json(json))
}

function update(req, res) {
  db.show('status', req.body.LCU)
  .then((json) => {
    status = _.find(json.RCUs, (item) => item.addr == req.body.RCU)
    if (status == undefined) {
      return res.status(400).json({})
    }
    // merge with current status
    let lightStatus = _.assign({}, status.lightStatus, req.body.lightStatus)
    return comm.setStatus(req.body.LCU, req.body.RCU, lightStatus)
      .then(() => res.send({}))
  })
}

export default status
