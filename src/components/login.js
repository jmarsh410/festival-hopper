/* jshint ignore:start */

import React, { Component } from 'react';
import ButtonAnchor from './button-anchor';
import '../styles/login.css';
import pbuLogo from '../images/pbu_40_black.png';
const authURL = 'https://untappd.com/oauth/authenticate/?client_id=B37286DA6E41C3C75634F4C0DB726E889052525C&response_type=token&redirect_url=http://festivalhopper.jeredmarshall.com/';

class Login extends Component {
  render(){
    return (
      <section className="login">
        <h1 className="login-title">Festival Hopper</h1>
        <img className="login-attribution" alt="Powered by Untappd" src={pbuLogo}/>
        <p>You are not connected to Untappd, please login before proceeding</p>
        <ButtonAnchor href={authURL} classes="btn--block btn--positive btn--connect" text="Connect to Untappd"/>
      </section>
    );
  }
}

export default Login;