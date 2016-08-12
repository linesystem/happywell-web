import { TYPES } from '../constants'
import _ from 'lodash'

export default function status(state = {}, action) {
  switch (action.type) {
    case TYPES.SOCKET_STATUS:
      let obj = _.assign({}, state)
      obj[action.payload.id] = action.payload.status
      return obj
    case TYPES.GET_STATUS:
      return _.assign({}, state, action.payload.responded)
    default:
      return state
  }
}
