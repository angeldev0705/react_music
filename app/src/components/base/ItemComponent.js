import React from 'react';
import { Component } from '../../base/Component';

export class ItemComponent extends Component {
  state = {
    item: {}
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        dff
        {item}
      </div>
    );
  }
}
