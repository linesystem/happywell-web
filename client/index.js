import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory, hashHistory } from 'react-router'
import configureStore from './store'
import routes from './routes'

const store = configureStore()
let history
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE) {
  history = hashHistory
} else {
  history = browserHistory
}

ReactDOM.render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,
  document.getElementById('root')
)
