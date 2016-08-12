import db from '../storage'
import _ from 'lodash'
var roomIndex = {
  index: index,
  update: update
}

function index(req, res) {
  db.index('room-index')
  .then((json) => {
    res.send(json)
  })
}

function update(req, res) {
  db.saveData('room-index', req.body)
  .then((json) => {
    res.send(json)
  })
}

export default roomIndex
