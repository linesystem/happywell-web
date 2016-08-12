import React, { Component } from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import { putData } from '../actions'
import Select from 'react-select'

const COLNUM = [
  { value: 12, label: "12" },
  { value: 6, label: "6" },
  { value: 4, label: "4" },
  { value: 3, label: "3" },
  { value: 2, label: "2" },
  { value: 1, label: "1" }
]

const ROWNUM = [
  { value: 10, label: "10" },
  { value: 7, label: "7" },
  { value: 5, label: "5" },
  { value: 3, label: "3" },
  { value: 1, label: "1" }
]

export default class LayoutModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      colCount: (props.users.colCount || 4),
      rowCount: (props.users.rowCount || 5)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      colCount: (nextProps.users.colCount || 4),
      rowCount: (nextProps.users.rowCount || 5)
    })
  }

  setColCount(val) {
    this.setState({ colCount: val.value })
  }

  setRowCount(val) {
    this.setState({ rowCount: val.value })
  }

  saveCount() {
    const { dispatch, closeFunc, users } = this.props
    var body = {
      colCount: this.state.colCount,
      rowCount: this.state.rowCount
    }
    dispatch(putData(`/users/${users.id}`, body))
    closeFunc()
  }
  render() {
		const { isOpen, closeFunc, dispatch } = this.props
    return (
      <Modal className="modal-dialog layout-setting" closeTimeoutMS={150} isOpen={isOpen}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={closeFunc}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">객실레이아웃</h4>
          </div>
          <div className="modal-body">
            <div className="inputs">
              <ul>
                <li>
                  <label>열 갯수</label>
                  <Select
                    name="colCount"
                    value={this.state.colCount}
                    options={COLNUM}
                    onChange={this.setColCount.bind(this)}
                    className="col-count"
                    clearable={false}
                  />
                </li>
                <li>
                  <label>행 갯수</label>
                  <Select
                    name="rowCount"
                    value={this.state.rowCount}
                    options={ROWNUM}
                    onChange={this.setRowCount.bind(this)}
                    className="row-count"
                    clearable={false}
                  />
                </li>
              </ul>
            </div>
            <div className="summit">
              <button className="btn btn-primary-outline btn-sm" onClick={this.saveCount.bind(this)}>
                적  용
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
