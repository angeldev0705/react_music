import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { Config } from '../../Config';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Icon } from '../../components/misc/Icon';
import { Link } from '../../components/misc/Link';
import { Loading } from '../../components/misc/Loading';
import { Form, Input } from '../../components/misc/Form';
import DocumentMeta from 'react-document-meta';
import { Request } from '../../util/Request';

export class ResetPassword extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any
  };
  state = {
    isLoading: false
  };

  handleSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.getValue();
    let code = this.refs.code.getValue();
    let password = this.refs.password.getValue();

    this.setState({ isLoading: true });

    Request.post('account/reset_password', {
      email: email,
      codigo: code,
      clave: password
    })
      .then(data => {
        this.getNotificationCenter().addNotification({
          message: 'Listo ahora ya puedes iniciar sesión',
          level: 'success',
          position: 'bc',
          autoDismiss: 10
        });

        this.context.router.replace({
          pathname: RouteGenerator.default('acceder')
        });
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

  render() {
    let query = this.props.location.query || {};
    let defaultEmail = query.email || '';
    let defaultCode = query.code || '';

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
            <h1>Cambiar mi contraseña</h1>
          </div>
        )}
        <div className="home">
          <div className="home-container">
            <div className="col-sm-12">
              <Form
                onSubmit={this.handleSubmit.bind(this)}
                type="vertical"
                className="form-login"
              >
                {!this.context.isMobile && (
                  <div className="logo">{Config.app.name}</div>
                )}

                <Input
                  type="email"
                  autoComplete={false}
                  defaultValue={defaultEmail}
                  required={true}
                  ref="email"
                  layout="rows"
                  placeholder="E-mail"
                  size="lg"
                />

                <Input
                  type="text"
                  autoComplete={false}
                  defaultValue={defaultCode}
                  required={true}
                  ref="code"
                  layout="rows"
                  placeholder="Código de recuperación"
                  size="lg"
                />

                <Input
                  type="password"
                  autoComplete={false}
                  required={true}
                  ref="password"
                  layout="rows"
                  placeholder="Nueva contraseña"
                  size="lg"
                />

                <div className="form-group">
                  <div className="center-container">
                    {!this.state.isLoading && (
                      <button type="submit" className="btn btn-lg btn-primary">
                        Cambiar contraseña
                      </button>
                    )}
                    {this.state.isLoading && (
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-lg  btn-primary"
                      >
                        <Loading type="mini" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="center-container">
                    <Link
                      to={RouteGenerator.default('recuperar')}
                      className="btn btn-lg btn-default"
                    >
                      no tengo el código
                    </Link>
                  </div>
                </div>

                <hr />

                <div className="form-group">
                  <div className="center-container">
                    <Link
                      to={RouteGenerator.default('acceder')}
                      className="btn btn-md btn-link"
                    >
                      <Icon name="arrow_back" /> Iniciar sesión
                    </Link>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
