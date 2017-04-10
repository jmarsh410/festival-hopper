/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/error-item.css';

class ErrorItem extends Component {
  render(){
    return (
      <div className="error">
        {this.props.data.message}
      </div>
    );
  }
}

export default ErrorItem;