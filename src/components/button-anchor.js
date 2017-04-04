/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/button.css';

class ButtonAnchor extends Component {
  render(){
    const classes = 'btn ' + this.props.classes;
    return (
      <a href={this.props.href} className={classes}>{this.props.text}</a>
    );
  }
}

export default ButtonAnchor;