import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'lodash'
import { signIn } from '../actions'

class SignIn extends Component {
  componentWillReceiveProps(nextProps) {
    const { users } = nextProps
    if (users.signIn == true) {
      window.location = "/"
    }
  }

  handleSubmit() {
    const { dispatch } = this.props
    dispatch(signIn({
      id: this.refs.ID.value,
      password: this.refs.password.value
    }))
  }

  render() {
    const { users } = this.props
    return (
      <div className="signin">
        <div className="form card">
          {
            users.message ?
              <div className="message"> <h6>{users.message}</h6> </div> :
              <div/>
          }
          <div className="id input">
            <label>ID</label> 
            <input ref="ID" type="text" className="form-control" placeholder="ID를 입력하세요"/>
          </div>
          <div className="password input">
            <label>Password</label> 
            <input ref="password" type="password" className="form-control" placeholder="비밀번호를 입력하세요"/>
          </div>
          <div className="summit input">
            <button type="submit" className="btn btn-info btn-fill" onClick={this.handleSubmit.bind(this)}>
              입   력
            </button>
          </div>
        </div>
      </div>
    )
  }
}

SignIn.propTypes = {
  users: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { users } = state
  return { users }
}

export default connect(mapStateToProps)(SignIn)
