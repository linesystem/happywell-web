import React, { Component } from 'react'
import CommModal from './commModal'
import LayoutModal from './layoutModal'

export default class FooterBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commModalOpen: false,
      layoutModalOpen: false
    }
  }

  closeModal(key) {
    let obj = {}
    obj[key] = false
    this.setState(obj)
  }

  openModal(key) {
    let obj = {}
    obj[key] = true
    this.setState(obj)
  }

  render() {
    const { dispatch, path, ports, users } = this.props
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="pull-right">
            {
              path == "/rooms" || path == "/" ?
                <button className="btn btn-primary-outline btn-sm" onClick={this.openModal.bind(this, 'layoutModalOpen')}> 객실레이아웃 </button> :
                ""
            }
            <a href="/log" target="_blank">
              <button className="btn btn-primary-outline btn-sm">
                로그보기
              </button>
            </a>
            <button className="btn btn-primary-outline btn-sm" onClick={this.openModal.bind(this, 'commModalOpen')}>
              포트설정
            </button>
          </div>
        </div>
        <CommModal ports={ports} isOpen={this.state.commModalOpen} closeFunc={this.closeModal.bind(this, 'commModalOpen')} dispatch={dispatch}/>
        <LayoutModal users={users} isOpen={this.state.layoutModalOpen} closeFunc={this.closeModal.bind(this, 'layoutModalOpen')} dispatch={dispatch}/>
      </footer>
    )
  }
}
