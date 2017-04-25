/* jshint ignore:start */

import React, { Component } from 'react';
import _ from 'lodash';
import '../styles/modal.css';

class Modal extends Component {
  render(){
    let close = null;
    if (_.isBoolean(this.props.close) && this.props.close) {
      close = (<div className="modalClose" onClick={this.props.onCloseClick}></div>);
    }
    return (
      <div className="modalContainer">
        <div className="modalContent">
          {close}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;