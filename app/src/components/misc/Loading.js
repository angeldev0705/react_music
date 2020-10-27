import React from 'react';
import { Component } from '../../base/Component';

export class Loading extends Component {
  render() {
    let className = this.props.type || 'normal';

    return (
      <div className={'loading loading-' + className}>
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      </div>
    );
  }
}
