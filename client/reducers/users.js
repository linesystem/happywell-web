import { TYPES } from '../constants'
import _ from 'lodash'

export default function users(state = {}, action) {
  switch (action.type) {
    case TYPES.GET_USERS:
    case TYPES.PUT_USERS:
      if (action.payload.responded.signIn == true) {
        sessionStorage.setItem('token', action.payload.responded.token)
      }
      return _.assign({}, state, action.payload.responded)

    case TYPES.SIGN_IN:
      return _.assign({}, state, { signIn: true, token: action.payload.token })

    case TYPES.SIGN_OUT:
      sessionStorage.removeItem('token')
      window.location = "/"
      return _.assign({}, state, { signIn: false, token: undefined })

    default:
      return state
  }
}
