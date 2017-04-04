/* jshint ignore:start */

import React, { Component } from 'react';
import StaticBeerList from './static-beer-list';
import utils from '../utils/utils';

// need to make an api call to get back all the beer info for each beer id
// beer id needs to somehow be passed to this page from whatever link was pressed on the previous page

class BreweryBeers extends Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
    };
    this.breweryId = this.props.match.params.breweryId;
    this.getBeers();
  }
  getBeers(){
    const self = this;
    if (!localStorage.userToken) {
      return console.log('User is not logged in');
    }
    fetch(utils.generateBreweryInfoUrl(this.breweryId))
        .then((response)=>{
          if (response.status !== 200) {
            return new Error('The server responded with a status code of' + response.status);
          }
          return response.json();
        })
        .then((json)=>{
          console.log(json);
          // generate the items
          const items = utils.makeBreweryBeers(json);
          // set the state
          self.setState({
            items: items
          });
        })
        .catch((err)=>{
          console.error(err);
        });
  }
  render() {
    return (
      <StaticBeerList items={this.state.items}/>
    );
  }
}

export default BreweryBeers;