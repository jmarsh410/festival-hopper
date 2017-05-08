import React, { Component } from 'react';
import '../styles/search.css';
import '../styles/button.css';

class Search extends Component {
  render() {
    return (
      <form className="search" onSubmit={this.props.handleSubmit} noValidate>
        <input className="search-field" type="text" name={this.props.inputName} placeholder={this.props.placeholder} />
        <button className="search-btn btn btn--positive" type="submit">Submit</button>
      </form>
    );
  }
}

export default Search;