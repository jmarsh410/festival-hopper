/* jshint ignore:start */

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import Header from './components/header';
import Nav from './components/nav';
import Login from './components/login.js';
import Categories from './components/categories';
import BrewerySearch from './components/brewery-search';
import BeerListContainer from './components/beer-list-container';
import './App.css';

const urlParameter = '#access_token=';
// const client_id = 'B37286DA6E41C3C75634F4C0DB726E889052525C';
// const client_secret = '8E445ABC27BC99A5D67CBB98AEAA2E936E02AE28';
// const myToken = '336DB8FB0FDED71D92E55514EFD2132931270D40';
// http://REDIRECT_URL#access_token=336DB8FB0FDED71D92E55514EFD2132931270D40

// test account user token
// #access_token=336DB8FB0FDED71D92E55514EFD2132931270D40

// use when testing signup process
// localStorage.clear();

class App extends Component {
  authenticate() {
    // check if the user's auth token can be found in local storage or a query string
    // be aware that this method won't work if there is any other information in the url after the access_token. though if access_token exists, it would always be alone since this would be right after authenticating
    if (localStorage.getItem('userToken')) {
      return true;
    } else {
      const queryToken = window.location.href.indexOf(urlParameter) > -1 ? window.location.href.split(urlParameter).pop() : null;
      if (queryToken) {
        localStorage.setItem('userToken', queryToken);
        return true;
      }
    }
    return false;
  }
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Route path="/" children={(props)=>{
            // used the children render method because it always gets called regardless of current route/location
            return props.location.pathname !== '/login' ? (<Nav/>) : null; 
          }}/>
          <main>
            <Route exact path="/" render={()=> {
              return this.authenticate() ? (<Redirect to="/curated"/>) : (<Redirect to="/login"/>);
            }}/>
            <Route path="/logout" render={()=>{
              // delete the user token from local storage
              localStorage.clear();
              return (<Redirect to="/"/>);
            }}/>
            <Route exact path="/curated" component={Categories}/>
            <Route path="/curated/:listId" component={BeerListContainer}/>
            <Route exact path="/brewery-search" component={BrewerySearch}/>
            <Route path="/brewery/:listId" component={BeerListContainer}/>
            <Route path="/login" component={Login}/>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;