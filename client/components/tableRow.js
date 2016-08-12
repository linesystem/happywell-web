import React, { Component } from 'react'
import _ from 'lodash'

export default class TableRow extends Component {
  render() {
    const { values, onClick, style } = this.props
    let inlineStyle = style || {}
    let list = _.map(values, (value, i) => (<td key={i}>{value}</td>))
    if (_.isFunction(onClick)) {
      return (<tr style={inlineStyle} onClick={onClick}>{list}</tr>)
    } else {
      return (<tr style={inlineStyle}>{list}</tr>)
    }
  }
}
