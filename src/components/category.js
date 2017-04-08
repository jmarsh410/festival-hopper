/* jshint ignore:start */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/category.css';

class Category extends Component {
  render(){
    const id = '/curated/' + this.props.data.name.replace(' ', '-').toLowerCase();
    return (
      <Link to={{
        pathname: id
      }} className="category">
        <div className="category-image">
          <img src={this.props.data.img} alt={this.props.data.name}/>
        </div>
        <div className="category-info">
          <div className="category-name">{this.props.data.name}</div>
          <div className="category-location">{this.props.data.location}</div>
        </div>
      </Link>
    );
  }
}

export default Category;