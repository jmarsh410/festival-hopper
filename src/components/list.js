/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/list.css';

class List extends Component {
  render() {
    if (this.props.items.length === 0) {
      return (
        <div>'loading...'</div>
      );
    }
    const Type = this.props.type;
    const html = this.props.items.map((item, i) => {
      // if the item doesn't have an id property, then default to showing the array index
      const key = item.id ? item.id : i;
      return <li key={key} className="list-item"><Type index={i} data={item}/></li>;
    });
    return (
      <div className="list">
        <h1 className="list-title">{ this.props.title }</h1>
        <ul className="list-main" onClick={this.props.onClick} onChange={this.props.onChange}>
          { html }
        </ul>
      </div>
    );
  }
}

export default List;