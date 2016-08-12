import React, { Component } from 'react'
import { Link } from 'react-router'

export default class SideBar extends Component {
  render() {
    return (
      <div className="sidebar" data-color="blue" data-image="assets/img/sidebar-5.jpg">
        <div className="sidebar-wrapper">
          <div className="logo">
            <Link to="/" className="simple-text">
              HappyWell
            </Link>
          </div>
          <ul className="nav">
            <li>
              <Link to="/rooms">
                <i className="pe-7s-switch" />
                <p>Main</p>
              </Link>
            </li>
            <li>
              <Link to="devices">
                <i className="pe-7s-network" />
                <p>Devices</p>
              </Link>
            </li>
            <li>
              <Link to="status">
                <i className="pe-7s-signal" />
                <p>Status</p>
              </Link>
            </li>
            <li>
              <Link to="setting">
                <i className="pe-7s-tools" />
                <p>setting</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
