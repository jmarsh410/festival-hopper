/* jshint ignore:start */

import React, { Component } from 'react';
import _ from 'lodash';
import '../styles/list.css';

class List extends Component {
  render() {
    const Type = this.props.type;
    const flatItems = _.flatten(this.props.items); // flatten the items a single level
    const deDupeItems = _.uniqBy(flatItems, 'id'); // remove duplicate beers
    const html = deDupeItems.map((item, i) => {
      // if the item doesn't have an id property, then default to showing the array index
      const key = item.id ? item.id : i;
      return <li key={key} className="list-item"><Type index={i} data={item}/></li>;
    });
    let title = null;
    // don't show title if there are no items in the list
    if (this.props.title && html.length > 0) {
      title = (<h1 className="list-title">{ this.props.title }</h1>);
    }
    return (
      <div className="list">
        {title}
        <ul className="list-main" onClick={this.props.onClick} onChange={this.props.onChange}>
          { html }
        </ul>
      </div>
    );
  }
}

export default List;