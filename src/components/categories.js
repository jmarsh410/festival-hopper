/* jshint ignore:start */

import React, { Component } from 'react';
import List from './list';
import Category from './category';
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
  render() {
    return (
      <div centered={true}>
        <List items={Items} type={Category} title="Curated Lists" />
      </div>
    );
  }
}

export default Categories;