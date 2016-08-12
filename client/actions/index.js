import promise from 'es6-promise'
promise.polyfill()
import fetch from 'isomorphic-fetch'
import { TYPES } from '../constants'
const localhost = "http://" + window.location.hostname

export function signIn(payload) {
  if (payload.token) {
    sendRequest('GET', '/users/')
    return {
      type: TYPES.SIGN_IN,
      payload: { token: payload.token, signIn: true }
    }
  }
  return sendRequest('POST', '/users/signin', {
    id: payload.id,
    password: payload.password
  })
}

export function signOut() {
  return {
    type: TYPES.SIGN_OUT,
    payload: {}
  }
}

export function socketStatus(data) {
  return {
    type: TYPES.SOCKET_STATUS,
    payload: data
  }
}

export function socketDevices(data) {
  return {
    type: TYPES.SOCKET_DEVICES,
    payload: data
  }
}

export function getData(endpoint) {
  return sendRequest('GET', endpoint)
}

export function putData(endpoint, json) {
  return sendRequest('PUT', endpoint, json)
}

export function postData(endpoint, json) {
  return sendRequest('POST', endpoint, json)
}

function sendRequest(method, endpoint, data) {
  var options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }
  if (data) {
    options.body = JSON.stringify(data)
  }

  var token = sessionStorage.getItem('token')
  var uri =  localhost + "/api" + endpoint + `?access_token=${token}`
  return (dispatch) => {
    return fetch(uri, options)
      .then((response) => {
        if (response.status != 200 && response.status != 304) {
          if (response.status == 400 || response.status == 401) {
            alert("중복접속으로 로그아웃합니다")
            dispatch(signOut())
            return {}
          }
          alert("status:", response.status, ", statusText:", response.statusText)
          return {}
        }
        return response.json()
      })
      .then((json) => dispatch(responded(method, endpoint, json, data)))
  }
}

function responded(method, endpoint, responded, sent) {
  return {
    type: getType(method, endpoint),
    payload: {
      responded: responded,
      sent: sent
    }
  }
}

function getType(method, endpoint) {
  let resource = endpoint.split("/")[1]
  switch(resource) {
    case "devices":
      return TYPES.GET_DEVICES
    case "status":
      if (method == "GET") {
        return TYPES.GET_STATUS
      } else if (method == "PUT") {
        return TYPES.PUT_STATUS
      }
    case "rooms":
      if (method == "GET") {
        return TYPES.GET_ROOMS
      } else if (method == "PUT") {
        return TYPES.PUT_ROOMS
      }
    case "room-index":
      if (method == "GET") {
        return TYPES.GET_ROOM_INDEX
      } else if (method == "PUT") {
        return TYPES.PUT_ROOM_INDEX
      }
    case "ports":
      if (method == "GET") {
        return TYPES.GET_PORTS
      } else if (method == "PUT") {
        return ""
      }
    case "users":
      if (method == "GET" || method == "POST") {
        return TYPES.GET_USERS
      } else if (method == "PUT") {
        return TYPES.PUT_USERS
      }
    default:
      return ""
  }
}
