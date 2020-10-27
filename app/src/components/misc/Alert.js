import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from './Icon';

export class Alert extends Component {
  state = {
    isVisible: true
  };

  render() {
    let message = this.props.message || 'Nada por aqui :(';

    if (!this.state.isVisible) {
      return null;
    }

    let type = this.props.type || 'warning';
    let className = `alert alert-${type} alert-dismissible fade in`;

    return (
      <div className="col-xs-12">
        <div className={className}>
          {this.props.close && (
            <button
              type="button"
              className="close"
              onTouchTap={() => {
                this.setState({ isVisible: false });
              }}
            >
              <Icon name="close" />
            </button>
          )}
          <strong>{message}</strong>.
        </div>
      </div>
    );
  }
}
