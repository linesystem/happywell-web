import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './containers/app'
import SignIn from './containers/signin'
import Rooms from './containers/rooms'
import Devices from './containers/devices'
import Status from './containers/status'
import Setting from './containers/setting'
import { checkauth } from './auth'

const requireAuth = (nextState, replace) => {
  if (!checkauth()) {
    return replace('/signin')
  }
}

const Routes = (
  <Route>
    <Route path="/" component={App} onEnter={requireAuth}>
      <IndexRoute component={Rooms}/>
      <Route path="/rooms" component={Rooms}/>
      <Route path="/devices" component={Devices}/>
      <Route path="/status" component={Status}/>
      <Route path="/setting" component={Setting}/>
    </Route>
    <Route path="/signin" component={SignIn}/>
  </Route>
)

export default Routes
