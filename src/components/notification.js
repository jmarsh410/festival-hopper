/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/notification.css';

class Notification extends Component {
  render(){
    let classes = 'notification';
    if (this.props.data.type === 'error') {
      classes += ' error';
    }
    return (
      <span className={classes}>{this.props.data.text}</span>
    );
  }
}

export default Notification;