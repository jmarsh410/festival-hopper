/* jshint ignore:start */

import React, { Component } from 'react';

class Button extends Component {
  render(){
    const classes = 'btn ' + this.props.variant;
    return (
      <button className={classes}>{this.props.text}</button>
    );
  }
}

export default Button;