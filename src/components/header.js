/* jshint ignore:start */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header-logo">Festival Hopper</div>
        <Link to="/logout">Log out</Link>
      </header>
    );
  }
}

export default Header;