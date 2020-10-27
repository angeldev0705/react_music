import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Icon } from '../../components/misc/Icon';
import { Login as UserLogin } from '../../components/account/Login';
import DocumentMeta from 'react-document-meta';

export class Login extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  onSuccess() {
    this.getNotificationCenter().addNotification({
      message: 'Redirigiendo...',
      level: 'info',
      position: 'bc',
      autoDismiss: 2
    });
    let redirTo =
      this.props.location && this.props.location.query
        ? this.props.location.query.redir
        : RouteGenerator.default('usuario');
    setTimeout(() => {
      this.context.router.replace({ pathname: redirTo });
    }, 1000);
  }

  render() {
    return (
      <div>
        <DocumentMeta {...SEO.default()} />
        {this.context.isMobile && (
          <div className="page-title primary shadow">
            <Icon
              name="menu"
              className="menu"
              onTouchTap={this.toggleMenu.bind(this)}
            />
            <h1>Iniciar sesión</h1>
          </div>
        )}
        <div className="home">
          <div className="home-container">
            <UserLogin onSuccess={this.onSuccess.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
