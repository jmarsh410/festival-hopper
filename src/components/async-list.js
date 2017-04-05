/* jshint ignore:start */

import React, { Component } from 'react';

class AsyncList extends Component {
  render(){
    if (this.props.items.length === 0) {
      return (
        <div>'loading...'</div>
      );
    }
    const Type = this.props.type;
    return (
      <Type items={this.props.items}/>
    );
  }
}

export default AsyncList;