import express  from 'express'
import passport from 'passport'
import * as Local from 'passport-local'
import * as Token from 'passport-token-auth'
import _        from 'lodash'
import crypto   from 'crypto'
import Promise  from 'bluebird'
import db       from '../storage'
import devices  from './devices'
import status   from './status'
import users    from './users'
import rooms    from './rooms'
import ports    from './ports'
import roomIndex from './roomIndex'

var cryptoAsync = Promise.promisifyAll(crypto)
var Router = express.Router()

// token authtication for api
passport.use(new Token.Strategy((token, done) => {
  db.index('users')
  .then((json) => {
    let user = _.find(json, (user) => user.token == token)
    if (!user) { return done(null, false) }
    return done(null, user)
  })
}))

// local authtication for signin
passport.use(new Local.Strategy({
  usernameField: 'id',
  passwordField: 'password',
  session: false
}, (username, password, done) => {
  db.index('users')
  .then((json) => {
    let user = _.find(json, (user) => user.username == username)
    if (!user) { return done(null, {}, { message: '존재하지 않는 사용자입니다' }) }
    if (user.password != password) { return done(null, {}, { message: '패스워드를 확인하세요' }) }
    return cryptoAsync.randomBytesAsync(12)
      .then((buffer) => {
        let token = buffer.toString('hex')
        user.token = token
        return db.update('users', user.id, user)
      }).then(() => done(null, user))
  })
}))


// define routes
Router.get('/devices', passport.authenticate('token', { session: false }), (req, res) => devices.index(req, res))
Router.post('/devices/reset', passport.authenticate('token', { session: false }), (req, res) => devices.reset(req, res))
Router.post('/devices/reload', passport.authenticate('token', { session: false }), (req, res) => devices.reload(req, res))
Router.get('/ports', passport.authenticate('token', { session: false }), (req, res) => ports.index(req, res))
Router.post('/ports/connect', passport.authenticate('token', { session: false }), (req, res) => ports.connect(req, res))
Router.get('/status', passport.authenticate('token', { session: false }), (req, res) => status.index(req, res))
Router.put('/status', passport.authenticate('token', { session: false }), (req, res) => status.update(req, res))
Router.get('/rooms', passport.authenticate('token', { session: false }), (req, res) => rooms.index(req, res))
Router.put('/rooms', passport.authenticate('token', { session: false }), (req, res) => rooms.update(req, res))
Router.get('/room-index', passport.authenticate('token', { session: false }), (req, res) => roomIndex.index(req, res))
Router.put('/room-index', passport.authenticate('token', { session: false }), (req, res) => roomIndex.update(req, res))
Router.put('/users/:id', passport.authenticate('token', { session: false }), (req, res) => users.update(req, res))
Router.get('/users', passport.authenticate('token', { session: false }), (req, res) => users.show(req, res))
Router.post('/users/signin', passport.authenticate('local', { session: false }), (req, res) => users.signin(req, res))

export default Router
