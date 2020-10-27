import React from 'react';
import { Component } from '../base/Component';
import { Config } from '../Config';

export class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <footer className="footer">
        <p>
          Todos los derechos Reservados {Config.app.name}{' '}
          {this.state.date.getFullYear()}
        </p>
      </footer>
    );
  }
}
