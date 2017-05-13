/* jshint ignore:start */

import React, { Component } from 'react';
import '../styles/beer-list-controls.css';

class BeerListControls extends Component {
  render(){
    return (
      <div className="beerListControls">
        {this.props.children}
      </div>
    );
  }
}

export default BeerListControls;