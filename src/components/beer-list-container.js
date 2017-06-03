/* jshint ignore:start */

import React, { Component } from 'react';
import _ from 'lodash';
import Beer from './beer';
import BeerListControls from './beer-list-controls';
import List from './list';
import utils from '../utils/utils';
import DataLists from '../data-lists';
import LoadingSpinner from './loading-spinner';
import Modal from './modal';
import Notification from './notification';
import Search from './search';
import Select from './select';

// storage for 
const apiCallInfo = {
  brewery: {
    endpoint: utils.generateBreweryInfoUrl,
    normalizeData: utils.normalizeBreweryBeers,
    makeList: utils.makeBreweryBeerList,
  }
};

const sortTerms = {
  'Brewery Name A-Z': 'brewery',
  'Beer Name A-Z': 'name',
}

class BeerListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      list: { id: null, beers: null, checkCount: 0, totalCount: 0 },
      errors: [],
      isLoading: false,
      notifications: [],
      waiting: false,
      searchField: null,
      sortField: Object.keys(sortTerms)[0],
    };
    this.handleCheckInClick = this.handleCheckInClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);

    this.defaultListSize = 25;
    this.maxItems = null;
    this.listId = this.props.match.params.listId;
    this.listType = this.props.location.pathname.split('/')[1];
    if (this.listType !== 'curated') {
      this.isAsync = true;
      this.needsFetch = true;
      this.apiEndpoint = apiCallInfo[this.listType].endpoint;
      this.normalizeData = apiCallInfo[this.listType].normalizeData;  
      this.makeList = apiCallInfo[this.listType].makeList;  
    }
  }
  showLoadingSpinner(){
    this.setState({ isLoading: true });
  }
  hideLoadingSpinner(){
    this.setState({ isLoading: false });
  }
  showModalSpinner(){
    this.setState({ waiting: true });
  }
  hideModalSpinner(){
    this.setState({ waiting: false });
  }
  addNotification(error){
    this.setState((prevState)=>{
      prevState.notifications.push(error);
      return { notifications: prevState.notifications };
    });
  }
  clearNotifications(){
    this.setState({
      notifications: []
    });
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
    // this.state.list.beers is an array of arrays
    const bucketNum = add ? this.state.list.beers.length : 0;
    const apiOffset = add ? bucketNum * this.defaultListSize : 0;
    this.clearNotifications();
    this.showLoadingSpinner();
    fetch(this.apiEndpoint(this.listId, apiOffset))
      .then((response)=>{
        if (response.status !== 200) {
          self.addNotification({ id: utils.generateId(), text: 'Error: Server responded with status code of ' + response.status, type: 'error' });
          return new Error('The server responded with a status code of' + response.status);
        }
        return response.json();
      })
      .then((json)=>{
        console.log(json);
        if (add) {
          const newBeers = this.normalizeData(json, bucketNum);
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
        self.hideLoadingSpinner();
      })
      .catch((err)=>{
        self.addNotification({ id: utils.generateId(), text: err, type: 'error' });
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
        // const list = utils.makeCuratedList(DataLists[this.listId], this.listId);
        const list = DataLists[this.listId];
        this.updateList(list);
      } else {
        // if this list hasn't been saved, get it
        this.fetchBeers();
      }
    }
  }
  handleModalClick(e) {
    this.setState({
      notifications: [],
    });
  }
  handleCheckInClick(e) {
    const self = this;
    const target = e.target;
    const listContainer = target.closest('.beers');
    // set the loader
    const checkedboxes = listContainer.querySelectorAll('.beer:not(.checkedIn) .checkbox input:checked');
    let count = checkedboxes.length;
    self.showModalSpinner();
    const done = function(){
      // get rid of the spinner
      self.hideModalSpinner();
    };
    const next = function(){
      --count;
      if (count === 0) {
        done();
      }
    };
    // get the beers that are checked, but HAVENT been checked in yet
    // loop through the checked items and send a check in for each one
    this.clearNotifications();
    checkedboxes.forEach((checkbox)=>{
      const beer = checkbox.closest('.beer');
      const bucket = beer.getAttribute('data-bucket');
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
      // only include ratings of 1 and higher. untappd won't accept lower values
      if (rating >= 1) {
        formData.append('rating', rating);
      }
      const fetchOpts = {
        method: 'POST',
        body: formData,
      }
      let fetchResponse;
      fetch(utils.generateCheckInUrl(), fetchOpts)
        .then((response)=>{
          fetchResponse = response;
          return response.json();
        })
        .then((json)=>{
          console.log(json);
          if (fetchResponse.status !== 200) {
            console.error('The server responded with: ' + fetchResponse.status);
            console.error(json.meta.error_detail);
            console.error('The beer that messed up was: ' + beerName + ':' + beerId);
            self.addNotification({ id: utils.generateId(), text: 'There was a problem checking in ' + beerName + '. ' + json.meta.error_detail, type: 'error' });
          } else {
            // log how many api calls you have left in the hour
            // this stopped working for some reason
            // console.log('Number of requests left are: ' + fetchResponse.headers['X-Ratelimit-Remaining']);
            self.setState((prevState)=>{
              prevState.list.beers[bucket][index].isCheckedIn = true;
              // clear out the check count
              prevState.list.checkCount = 0;
              prevState.notifications.push({ id: utils.generateId(), text: 'call was successful', type: 'generic' });
              return {
                list: prevState.list,
                notifications: prevState.notifications,
              };
            });
          }
          next();
        })
        .catch((err)=>{
          self.addNotification({ id: utils.generateId(), text: err, type: 'error' });
          console.log(err);
          next();
        });
    });
  }
  handleInputChange(e){
    const target = e.target;
    // don't do anything if the beer has already been checkedIn
    if (target.closest('.beer.checkedIn')){
      e.preventDefault();
      return;
    }
    const row = target.closest('.beer');
    const bucket = row.getAttribute('data-bucket');
    const index = row.getAttribute('data-index');
    // make it a favorite
    if (target.closest('.beer-favorite')) {
      this.setState((prevState)=>{
        prevState.list.beers[bucket][index].isFavorite = prevState.list.beers[bucket][index].isFavorite === true ? false : true;
        return { list: prevState.list };
      });
    }
    // check the beer
    if (target.closest('.beer-checkbox')) {
      this.setState((prevState)=>{
        if (target.checked === true) {
          ++prevState.list.checkCount;
        } else {
          --prevState.list.checkCount;
        }
        prevState.list.beers[bucket][index].checked = target.checked;
        return { list: prevState.list };
      });
    }
    // open the drawer
    if (target.closest('.beer-drawerToggle')) {
      this.setState((prevState)=>{
        // reverse the openness property that is on the item 
        prevState.list.beers[bucket][index].isOpen = prevState.list.beers[bucket][index].isOpen === true ? false : true;
        return { list: prevState.list };
      });
    }
    if (target.classList.contains('beer-description')) {
      this.setState((prevState)=>{
        prevState.list.beers[bucket][index].description = target.value;
        return { list: prevState.list };
      });
    }
    if (target.classList.contains('beer-slider')) {
      this.setState((prevState)=>{
        prevState.list.beers[bucket][index].rating = target.value;
        return { list: prevState.list };
      });
    }
  }
  handleSearchSubmit(e){
    e.preventDefault();
    // form element
    const searchTerm = e.target.querySelector('.search-field').value.toLowerCase().replace(' ', '');
    this.setState({
      searchField: searchTerm,
    });
  }
  handleSortChange(e){
    const value = e.target.value;
    this.setState({
      sortField: value,
    });
  }
  getFavoriteItems(){
    return _.filter(this.getFilteredItems(), (item)=>{
      return item.isFavorite === true;
    });
  }
  getFilteredItems(){
    var self = this;
    // filter the list based on current 'search' and 'sort' fields
    let beers = _.flatten(this.state.list.beers);
    // filter by search terms
    if (_.isString(this.state.searchField) && this.state.searchField.length > 0) {
      beers = beers.filter((beer) => {
        return beer.name.toLowerCase().replace(' ', '').includes(self.state.searchField) ? true : false;
      });
    }
    // filter by sort term
    if (_.isString(this.state.sortField) && this.state.sortField.length > 0) {
      const term = sortTerms[this.state.sortField];
      beers = _.sortBy(beers, [term]);
    }
    return beers;
  }
  componentWillMount(){
    // add a scroll event listener
    window.addEventListener('scroll', this.handleScroll);
    this.getInitialBeers();
  }
  componentWillUnmount(){
    // add a scroll event listener
    window.removeEventListener('scroll', this.handleScroll);
  }
  render(){
    // const self = this;
    // update the beer list on localStorage each time the state changes
    if (this.state.list.beers !== null){
      this.updateStorage(this.state.list);
    }
    // show the 'check-in' button if some of the beers are checkec
    let button = null;
    if (this.state.list.checkCount > 0) {
      button = (
        <button className="btn btn-checkIn" onClick={this.handleCheckInClick}>Check In: {this.state.list.checkCount}</button>
      );
    }
    // waiting for beer check-ins to respond, show modal with loading spinner
    let waiting = null;
    if (_.isBoolean(this.state.waiting) && this.state.waiting) {
      waiting = (
        <Modal>
          <LoadingSpinner/>
        </Modal>
      );
    }
    // waiting to load more beers, show loading spinner
    let loadingSpinner = null;
    if (this.state.isLoading) {
      loadingSpinner = (<LoadingSpinner/>);
    }
    // if there are notifications, show them in a modal
    let modal = null;
    if (_.isArray(this.state.notifications) && !_.isEmpty(this.state.notifications)) {
      modal = (
        <Modal onCloseClick={this.handleModalClick} close={true}>
          <List type={Notification} items={this.state.notifications}/>
        </Modal>
      );
    }
    // waiting for beer list to generate, show loading spinner
    if (!_.isArray(this.state.list.beers)) {
      return (
        <LoadingSpinner/>
      );
    }
    return (
      <div className="beers">
        <BeerListControls>
          <Search inputName="beer-search" placeholder="Search beer name..." handleSubmit={this.handleSearchSubmit}/>
          <Select id="beers-sort" label="Sort By:" options={Object.keys(sortTerms)} handleChange={this.handleSortChange}/>
        </BeerListControls>
        <List title="Favorites" items={this.getFavoriteItems()} type={Beer} onChange={this.handleInputChange}/>
        <List title={this.listId} items={this.getFilteredItems()} type={Beer} onChange={this.handleInputChange}/>
        {loadingSpinner}
        {button}
        {modal}
        {waiting}
      </div>
    )
  }
}

export default BeerListContainer;