/* jshint ignore:start */

import React, { Component } from 'react';
import Checkbox from './checkbox';
import '../styles/beer.css';

class Beer extends Component {
  render(){
    const id = this.props.data.id;
    const name = this.props.data.name;
    const brewery = this.props.data.brewery;
    const image = this.props.data.image;
    const checked = this.props.data.checked;
    const rating = this.props.data.rating;
    const description = this.props.data.description;
    const isCheckedIn = this.props.data.isCheckedIn;
    const isOpen = this.props.data.isOpen;
    const bucket = this.props.data.bucket;
    const index = this.props.data.index;
    let classes = 'beer';
    if (isCheckedIn) {
      classes += ' checkedIn';
    }
    if (isOpen) {
      classes += ' open';
    }
    return (
      <div className={classes} data-id={id} data-name={name} data-bucket={bucket} data-index={index}>
        <div className="beer-main">
          <div className="beer-image">
            <img src={image} alt={name}/>
          </div>
          <div className="beer-info">
            <div className="beer-name">{name}</div>
            <div className="beer-brewery">{brewery}</div>
          </div>
          <Checkbox classes="beer-checkbox" checked={checked}/>
        </div>
        <div className="beer-drawer">
          <div className="beer-drawerInner">
            <textarea className="beer-description" maxLength="140" defaultValue={description}></textarea>
            <div className="beer-rating">
              <input type="range" min="0" max="5" step=".5" defaultValue={rating} className="beer-slider"/>
              <div className="beer-sliderValue">{rating}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Beer;