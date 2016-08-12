import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

var store

export default function configureStore(preloadedState) {
  if (store == undefined) {
    store = createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(thunkMiddleware)
//      compose(
//        applyMiddleware(thunkMiddleware, createLogger()),
//        window.devToolsExtension ? window.devToolsExtension() : f => f
//      )
    )
  }
  return store
}
