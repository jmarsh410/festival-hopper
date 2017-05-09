/* jshint ignore:start */

import React, { Component } from 'react';

class Select extends Component {
  render(){
    const options = this.props.options.map((name)=>
      <option key={name} value={name}>{name}</option>
    );
    return (
      <div className="dropdown">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <select onChange={this.props.handleChange} name={this.props.id} id={this.props.id}>
          {options}
        </select>
      </div>
    );
  }

}

export default Select;