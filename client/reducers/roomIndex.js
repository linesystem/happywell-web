import { TYPES } from '../constants'
import _ from 'lodash'

export default function roomIndex(state = {}, action) {
  switch (action.type) {
    case TYPES.PUT_ROOM_INDEX:
      return _.assign({}, action.payload.sent)
    case TYPES.GET_ROOM_INDEX:
      return _.assign({}, action.payload.responded)
    default:
      return state
  }
}
