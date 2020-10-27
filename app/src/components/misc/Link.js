import React from 'react';
import { Component } from '../../base/Component';
import PubSub from 'pubsub-js';

export class Link extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  onClick(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  onTouchTap(e) {
    if (e) {
      e.preventDefault();
    }

    PubSub.publish('onClickLink', this.props);

    if (this.props.onTouchTap) {
      this.props.onTouchTap();
    }

    if (!this.props.noRedirect) {
      this.context.router.push({ pathname: this.props.to });
    }
  }

  render() {
    let extraProps = {};

    if (this.props.title) {
      extraProps.title = this.props.title;
    }
    if (this.props.onClick) {
      extraProps.onClick = this.props.onClick;
    }
    if (this.props.className) {
      extraProps.className = this.props.className;
    }

    return (
      <a
        href={this.props.to}
        onClick={this.onClick.bind(this)}
        onTouchTap={this.onTouchTap.bind(this)}
        {...extraProps}
      >
        {this.props.children}
      </a>
    );
  }
}
