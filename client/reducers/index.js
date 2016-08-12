import { combineReducers } from 'redux'
import devices from './devices'
import status from './status'
import rooms from './rooms'
import users from './users'
import ports from './ports'
import roomIndex from './roomIndex'

const rootReducer = combineReducers({
  devices,
  status,
  rooms,
  users,
  ports,
  roomIndex
})

export default rootReducer
