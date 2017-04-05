/* jshint ignore:start */

import React, { Component } from 'react';
import List from './list';
import Beer from './beer';
import '../styles/button.css';

// need to make an api call to get back all the beer info for each beer id
// beer id needs to somehow be passed to this page from whatever link was pressed on the previous page
const checkInEndpoint = 'https://api.untappd.com/v4/checkin/add?access_token=' + localStorage.userToken;

class StaticBeerList extends Component {
  constructor(props){
    super(props);
    this.state = {
      items: this.props.items,
      checked: 0,
    };
    this.handleCheckInClick = this.handleCheckInClick.bind(this);
    this.handleBeerClick = this.handleBeerClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
              prevState.items[index].checkedIn = true;
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
      // click came from the checkbox
      // count how many items are checked, if it is 1 or more, then show the 'check-in' button
      this.setState((prevState)=>{
        if (target.checked === true) {
          return { checked: ++prevState.checked };
        } else {
          return { checked: --prevState.checked };
        }
      });
    } else if (target.closest('.beer-main')) {
      // click came from .beer-main, so open the drawer
      const row = target.closest('.beer');
      const index = row.getAttribute('data-index');
      this.setState((prevState)=>{
        // reverse the openness property that is on the item 
        prevState.items[index].isOpen = prevState.items[index].isOpen === true ? false : true;
        return { items: prevState.items };
      });
    }
  }
  handleInputChange(e){
    const target = e.target;
    if (target.classList.contains('beer-slider')) {
      const row = target.closest('.beer');
      const index = row.getAttribute('data-index');
      this.setState((prevState)=>{
        prevState.items[index].rating = target.value;
        return { items: prevState.items };
      });
    }
  }
  render() {
    let button = null;
    if (this.state.checked > 0) {
      button = <button className="btn btn-checkIn" onClick={this.handleCheckInClick}>Check In</button>;
    }
    return (
      <div className="beers">
        <List items={this.state.items} type={Beer} onClick={this.handleBeerClick} onChange={this.handleInputChange}/>
        {button}
      </div>
    );
  }
}

export default StaticBeerList;