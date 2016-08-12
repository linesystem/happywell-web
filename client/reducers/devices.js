import { TYPES } from '../constants'
import _ from 'lodash'

export default function devices(state = {}, action) {
  switch (action.type) {
    case TYPES.GET_DEVICES:
      return _.assign({}, state, action.payload.responded)
    case TYPES.SOCKET_DEVICES:
      // if id is 0, reset device info
      if (action.payload.id == 0) {
        var obj = _.assign({})
      } else {
        var obj = _.assign({}, state)
        obj[action.payload.id] = action.payload.device
      }
      return obj
    default:
      return state
  }
}
