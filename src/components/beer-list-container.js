/* jshint ignore:start */

import React, { Component } from 'react';
import _ from 'lodash';
import Beer from './beer';
import List from './list';
import utils from '../utils/utils';
import DataLists from '../data-lists';

// need to make an api call to get back all the beer info for each beer id
// beer id needs to somehow be passed to this page from whatever link was pressed on the previous page
const checkInEndpoint = 'https://api.untappd.com/v4/checkin/add?access_token=' + localStorage.userToken;

// storage for 
const apiCallInfo = {
  brewery: {
    endpoint: utils.generateBreweryInfoUrl,
    normalizeData: utils.normalizeBreweryBeers,
    makeList: utils.makeBreweryBeerList,
  }
};

class BeerListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      list: { id: null, beers: null, checkCount: 0, totalCount: 0 },
    };
    this.handleCheckInClick = this.handleCheckInClick.bind(this);
    this.handleBeerClick = this.handleBeerClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.defaultListSize = 25;
    this.maxItems = null;
    this.listId = this.props.match.params.listId;
    this.listType = this.props.location.pathname.split('/')[1];
    if (this.listType !== 'curated') {
      this.needsFetch = true;
      this.apiEndpoint = apiCallInfo[this.listType].endpoint;
      this.normalizeData = apiCallInfo[this.listType].normalizeData;  
      this.makeList = apiCallInfo[this.listType].makeList;  
    }
    // add a scroll event listener
    window.addEventListener('scroll', this.handleScroll);
  }
  handleScroll(e){
    // if this is the bottom of the page, then see if theres more items to be loaded
    const bottomOfPage = window.innerHeight + window.pageYOffset === document.body.scrollHeight;
    const moreItemsNeedLoaded = this.state.list.maxItems > this.state.list.beerCount;
    if (bottomOfPage && moreItemsNeedLoaded){
      this.fetchBeers(true);
    }
  }
  updateList(list){
    this.setState({
      list: list
    });
  }
  updateStorage(list){
    // store beer list on localStorage
    localStorage[this.listId] = JSON.stringify(list);
  }
  fetchBeers(add){
    const self = this;
    const apiOffset = add ? this.state.list.beers.length * this.defaultListSize : 0;
    fetch(this.apiEndpoint(this.listId, apiOffset))
      .then((response)=>{
        if (response.status !== 200) {
          return new Error('The server responded with a status code of' + response.status);
        }
        return response.json();
      })
      .then((json)=>{
        console.log(json);
        if (add) {
          const newBeers = this.normalizeData(json);
          this.setState((prevState)=>{
            prevState.list.beers.push(newBeers);
            prevState.list.beerCount += newBeers.length;
            return { list: prevState.list };
          });
        } else {
          const list = self.makeList(json, self.listId);
          // set the state
          self.updateList(list);
        }
      })
      .catch((err)=>{
        console.error(err);
      });
  }
  getInitialBeers(){
    if (!localStorage.userToken) {
      return console.log('User is not logged in');
    }
    // check localStorage for this list's beers
    if (localStorage[this.listId]) {
      this.updateList(JSON.parse(localStorage[this.listId]));
    } else {
      // check whether this is a curated(stored) list or a list that needs an api call
      if (this.listType === 'curated') {
        // make sure the beers in the dataset are curated/normalized
        const list = utils.makeCuratedList(DataLists[this.listId], this.listId);
        this.updateList(list);
      } else {
        // if this list hasn't been saved, get it
        this.fetchBeers();
      }
    }
  }
  handleCheckInClick(e) {
    const self = this;
    // the button
    const target = e.target;
    const listContainer = target.closest('.beers');
    const checkedboxes = listContainer.querySelectorAll('.checkbox input:checked');
    // loop through the checked items and send a check in for each one
    checkedboxes.forEach((checkbox)=>{
      const beer = checkbox.closest('.beer');
      const index = beer.getAttribute('data-index');
      // make sure to multiply by -1. because the offset is positive if it is behind and vice versa
      const timezoneOffset = ((new Date().getTimezoneOffset() / 60) * -1) + ''; // make it a string
      const beerId = Number(beer.getAttribute('data-id'));
      const beerName = beer.getAttribute('data-name');
      const description = beer.querySelector('.beer-description').value;
      const rating = beer.querySelector('.beer-slider').value;
      // build up the post request to untappd
      const formData = new FormData();
      formData.append('gmt_offset', timezoneOffset);
      formData.append('timezone', 'PST');
      formData.append('bid', beerId);
      formData.append('shout', description);
      formData.append('rating', rating);
      const fetchOpts = {
        method: 'POST',
        body: formData,
      }
      let fetchResponse;
      fetch(checkInEndpoint, fetchOpts)
        .then((response)=>{
          fetchResponse = response;
          return response.json();
        })
        .then((json)=>{
          if (fetchResponse.status !== 200) {
            console.error('The server responded with: ' + fetchResponse.status);
            console.error(json.meta.error_detail);
            console.error('The beer that messed up was: ' + beerName + ':' + beerId);
          } else {
            console.log('call was successful');
            // log how many api calls you have left in the hour
            console.log('Number of requests left are: ' + fetchResponse.headers['x-ratelimit-remaining']);
            self.setState((prevState)=>{
              prevState.list.beers[index].isCheckedIn = true;
              return { list: prevState.list };
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
    });
  }
  handleBeerClick(e) {
    const target = e.target;
    if (target.closest('.beer.checkedIn')){
      e.preventDefault();
      return;
    }
    if (target.closest('.beer-checkbox')) {
      return;
    } else if (target.closest('.beer-main')) {
      // click came from .beer-main, so open the drawer
      const row = target.closest('.beer');
      const index = row.getAttribute('data-index');
      this.setState((prevState)=>{
        // reverse the openness property that is on the item 
        prevState.list.beers[index].isOpen = prevState.list.beers[index].isOpen === true ? false : true;
        return { list: prevState.list };
      });
    }
  }
  handleInputChange(e){
    const target = e.target;
    let row = target.closest('.beer');
    let index = row.getAttribute('data-index');
    if (target.classList.contains('beer-slider')) {
      this.setState((prevState)=>{
        prevState.list.beers[index].rating = target.value;
        return { list: prevState.list };
      });
    }
    if (target.classList.contains('beer-description')) {
      this.setState((prevState)=>{
        prevState.list.beers[index].description = target.value;
        return { list: prevState.list };
      });
    }
    if (target.classList.contains('checkbox-input')) {
      this.setState((prevState)=>{
        if (target.checked === true) {
          ++prevState.list.checkCount;
        } else {
          --prevState.list.checkCount;
        }
        prevState.list.beers[index].checked = target.checked;
        return { list: prevState.list };
      });
    }
  }
  componentWillMount(){
    this.getInitialBeers();
  }
  render(){
    if (this.state.list.beers !== null){
      this.updateStorage(this.state.list);
    }
    let button = null;
    if (this.state.list.checkCount > 0) {
      button = <button className="btn btn-checkIn" onClick={this.handleCheckInClick}>Check In</button>;
    }
    if (!_.isArray(this.state.list.beers)) {
      return (
        <div>'loading...'</div>
      );
    }
    return (
      <div className="beers">
        <List items={this.state.list.beers} type={Beer} onClick={this.handleBeerClick} onChange={this.handleInputChange}/>
        {button}
      </div>
    )
  }
}

export default BeerListContainer;