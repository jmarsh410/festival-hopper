/* jshint ignore:start */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <Link to="/">
          <div className="header-logo">Festival Hopper</div>
        </Link>
        <Link to="/logout" className="header-logout">Log out</Link>
      </header>
    );
  }
}

export default Header;