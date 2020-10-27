import React from 'react';
import { Component } from '../../base/Component';
import { Alert } from './Alert';

export class Empty extends Component {
  render() {
    return <Alert {...this.props} close={false} />;
  }
}
