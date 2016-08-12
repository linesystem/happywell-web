import React, { Component } from 'react'

export default class NaviBar extends Component {
  render() {
    const { signOut } = this.props
    return (
      <nav className="navbar navbar-default navbar-fixed">
        <div className="container-fluid">
          <div className="navbar-header">
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="" onClick={signOut}>
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
