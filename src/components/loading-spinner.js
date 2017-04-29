/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/loading-spinner.css';

class LoadingSpinner extends Component {
  render(){
    let classes = 'loadingSpinner';
    if (this.props.centered) {
      classes += ' loadingSpinner--centered';
    }
    return (
      <div className={classes}></div>
    );
  }
}

export default LoadingSpinner;