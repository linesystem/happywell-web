import { TYPES } from '../constants'
import _ from 'lodash'

export default function ports(state = {}, action) {
  switch (action.type) {
    case TYPES.GET_PORTS:
      return _.assign({}, state, action.payload.responded)
    default:
      return state
  }
}
