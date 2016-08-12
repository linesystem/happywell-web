import { TYPES } from '../constants'
import _ from 'lodash'

export default function rooms(state = {}, action) {
  switch (action.type) {
    case TYPES.PUT_ROOMS:
    case TYPES.GET_ROOMS:
      return _.assign({}, action.payload.responded)
    default:
      return state
  }
}
