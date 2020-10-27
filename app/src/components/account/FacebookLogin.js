import React from 'react';
import { Component } from '../../base/Component';
import { Auth } from '../../middleware/Auth';
import { FacebookLoginButton } from './FacebookLoginButton';
import PubSub from 'pubsub-js';

export class FacebookLogin extends Component {
  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onSuccessLogin',
      this.checkIsLogged.bind(this)
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkIsLogged() {
    //FIXME corregir esto
    //        let userProfile = this.context.userProfile || {};
    let userProfile = Auth.getProfile() || {};
    if (userProfile.id) {
      if (typeof this.props.onSuccess === 'function') {
        this.props.onSuccess();
      }
    }
  }

  render() {
    return (
      <FacebookLoginButton>{this.props.children || null}</FacebookLoginButton>
    );
  }
}
