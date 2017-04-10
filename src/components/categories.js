/* jshint ignore:start */

import React, { Component } from 'react';
import List from './list';
import Category from './category';
import BrewerySearch from './brewery-search';
import image from '../images/pbu_40_black.png';
import utils from '../utils/utils';

// css
import '../styles/categories.css';

const Items = [
  {
    id: utils.generateId(),
    name: 'The Purge',
    location: 'Jered\'s House',
    img: image,
  },
  {
    id: utils.generateId(),
    name: 'Drafthouse',
    location: 'Drafthouse Pub',
    img: image,
  },
];

class Categories extends Component {
  constructor(props){
    super(props);
    this.state = {
      breweries: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    const self = this;
    e.preventDefault();
    // get the contents of search-field and use it to search
    const breweryName = e.target.querySelector('.search-field').value;
    if (breweryName.length > 0) {
      // build the fetch
      const searchUrl = utils.generateBrewerySearchUrl(breweryName);
      let fetchResponse;
      fetch(searchUrl)
        .then((response)=>{
          fetchResponse = response;
          return response.json();
        })
        .then((json)=>{
          if (fetchResponse.status !== 200) {
            console.error('The server responded with: ' + fetchResponse.status);
            console.error(json.meta.error_detail);
          } else {
            console.log('call was successful');
            // log how many api calls you have left in the hour
            console.log('Number of requests left are: ' + fetchResponse.headers['x-ratelimit-remaining']);
            console.log(json);
            self.setState({
              breweries: utils.makeBreweryItems(json),
            });
          }
        })
        .catch((err)=>{
          console.error(err);
        });
    }
  }
  render() {
    return (
      <div className="categories">
        <BrewerySearch onSubmit={this.handleSubmit} breweries={this.state.breweries}/>
        <div className="categories-separator">or</div>
        <List items={Items} type={Category} title="Curated Lists" />
      </div>
    );
  }
}

export default Categories;