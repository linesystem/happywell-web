import db from '../storage'
import _ from 'lodash'
import crypto from 'crypto'
var rooms = {
  index: index,
  update: update
}

function index(req, res) {
  db.index('rooms')
  .then((json) => {
    res.send(json)
  })
}

function update(req, res) {
  _.each(req.body, (v, k) => {
    if (!v.uniqKey) {
      v.uniqKey = crypto.randomBytes(12).toString('hex')
    }
  })
  db.saveData('rooms', req.body)
  .then((json) => {
    console.log(json)
    res.send(json)
  })
}

export default rooms
