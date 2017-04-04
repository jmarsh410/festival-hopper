/* jshint ignore:start */

import React, { Component } from 'react';
import StaticBeerList from './static-beer-list';

class CuratedBeerList extends Component {
  render(){
    return (
      <StaticBeerList items={this.props.location.state.beers}/>
    );
  }
}

export default CuratedBeerList;