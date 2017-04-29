/* jshint ignore:start */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/nav.css';

class Nav extends Component {
  render() {
    return (
      <nav className="nav">
        <ul>
          <li>
            <NavLink to="/curated" activeClassName="selected" className="nav-curated">Curated Lists</NavLink>
          </li>
          <li>
            <NavLink to="/brewery-search" activeClassName="selected" className="nav-breweries">Search Breweries</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;