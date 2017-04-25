/* jshint ignore:start */

import React, { Component } from 'react';
import List from './list';
import Brewery from './brewery';
import '../styles/brewery-search.css';
import '../styles/search.css';
import '../styles/button.css';

class BrewerySearch extends Component {
  render(){
    let breweries = null;
    if (this.props.breweries) {
      breweries = (
        <List items={this.props.breweries} type={Brewery} title="Breweries" />
      )
    }
    return (
      <div className="brewerySearch">
        <form className="search" onSubmit={this.props.onSubmit} noValidate>
          <input className="search-field" type="text" name="brewery-name" placeholder="Search Breweries"/>
          <button className="search-btn btn btn--positive" type="submit">Submit</button>
        </form>
        { breweries }
      </div>
    );
  }
}

export default BrewerySearch;