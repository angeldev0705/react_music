import React from 'react';
import { Component } from '../../base/Component';
import { Loading } from '../misc/Loading';
import { Auth } from '../../middleware/Auth';
import { Config } from '../../Config';
import { Request } from '../../util/Request';

export class FacebookLoginButton extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any
  };

  state = {
    isLoading: false
  };

  loginWithAccessToken(token) {
    this.setState({ isLoading: true });

    Request.post('account/oauth_login', {
      oauth_provider: 'facebook',
      oauth_access_token: token
    })
      .then(data => {
        this.getNotificationCenter().addNotification({
          message: 'Iniciando...',
          level: 'info',
          position: 'bc',
          autoDismiss: 1
        });

        return Auth.login(data[Auth.queryName]);
      })
      .catch(err => {
        this.getNotificationCenter().addNotification({
          message: err.message || 'Error desconocido',
          level: 'warning',
          position: 'bc',
          autoDismiss: 2
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  login() {
    this.setState({ isLoading: true });

    FB.login(
      response => {
        if (response.status === 'connected') {
          let authResponse = response.authResponse || {};
          let accessToken = authResponse.accessToken || '';

          this.loginWithAccessToken(accessToken);

          this.getNotificationCenter().addNotification({
            message: 'Conectando...',
            level: 'info',
            position: 'bc',
            autoDismiss: 1
          });
        } else if (response.status === 'not_authorized') {
          this.getNotificationCenter().addNotification({
            message:
              'Para poder iniciar sesión debes conceder los permisos básicos',
            level: 'warning',
            position: 'bc',
            autoDismiss: 4
          });
          this.setState({ isLoading: false });
        } else {
          this.getNotificationCenter().addNotification({
            message: 'Ocurrió un error desconocido, intentalo nuevamente',
            level: 'error',
            position: 'bc',
            autoDismiss: 3
          });
          this.setState({ isLoading: false });
        }
      },
      { scope: Config.facebook.permissions || '' }
    );
  }

  render() {
    let className = 'btn btn-lg  ';
    className += this.props.className ? this.props.className : 'btn-facebook';

    return (
      <button
        type="button"
        onTouchTap={this.login.bind(this)}
        className={className}
      >
        {!this.state.isLoading && (
          <span> {this.props.children || 'Iniciar sesión con facebook'}</span>
        )}
        {this.state.isLoading && <Loading type="mini" />}
      </button>
    );
  }
}
