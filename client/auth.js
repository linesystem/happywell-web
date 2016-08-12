import configureStore from './store'
import { signIn } from './actions'
const store = configureStore()

export function checkauth() {
  const state = store.getState()
  if (!state.users.signIn) {
    let token = sessionStorage.getItem('token')
    if (token) {
      store.dispatch(signIn({token: token}))
      return true
    }
    return false
  }
  return true
}
