/* jshint ignore:start */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Brewery extends Component {
  render(){
    const breweryObj = this.props.data;
    const id = breweryObj.id;
    const name = breweryObj.name;
    const image = breweryObj.image;
    return (
      <Link to={{
        pathname: 'brewery/' + id,
      }} className="brewery">
        <div className="brewery-image">
          <img src={image} alt={name} />
        </div>
        <div className="brewery-info">
          <div className="brewery-name">{name}</div>
        </div>
      </Link>
    );
  }
}

export default Brewery;