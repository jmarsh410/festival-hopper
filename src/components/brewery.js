/* jshint ignore:start */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/category.css';

class Brewery extends Component {
  render(){
    const breweryObj = this.props.data;
    const id = breweryObj.id;
    const name = breweryObj.name;
    const image = breweryObj.image;
    return (
      <Link to={{
        pathname: 'brewery/' + id,
      }} className="category">
        <div className="category-image">
          <img src={image} alt={name} />
        </div>
        <div className="category-info">
          <div className="category-name">{name}</div>
        </div>
      </Link>
    );
  }
}

export default Brewery;