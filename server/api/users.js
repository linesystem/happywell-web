import db from '../storage'
import _ from 'lodash'
var users = {
  signin: signin,
  update: update,
  show: show
}

function signin(req, res) {
  if (_.isEmpty(req.user)) {
    return res.send({ signIn: false, message: req.authInfo.message })
  }
  return res.send(_.assign(_.omit(req.user, 'password'), { signIn: true }))
}

function update(req, res) {
  return db.update('users', req.params.id, req.body)
  .then((user) => res.send(_.omit(user, 'password')))
}

function show(req, res) {
  return res.send(_.assign(_.omit(req.user, 'password'), { signIn: true }))
}

export default users
