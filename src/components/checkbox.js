/* jshint ignore:start */

import React, { Component } from 'react';

class Checkbox extends Component {
  render(){
    const classes = this.props.classes + ' checkbox';
    return (
      <div className={classes}>
        <input type="checkbox" className="checkbox-input"/>
        <span className="checkbox-vis"></span>
      </div>
    );
  }
}

export default Checkbox;