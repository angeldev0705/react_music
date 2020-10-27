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

export class Recovery extends PageComponent {
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

    this.setState({ isLoading: true });

    Request.post('account/lost_password', {
      email: email
    })
      .then(data => {
        this.getNotificationCenter().addNotification({
          message:
            'Te hemos enviado un código a tu e-mail, ingresalo aqui para poder cambiar tu contraseña',
          level: 'info',
          position: 'bc',
          autoDismiss: 10
        });

        this.context.router.replace({
          pathname: RouteGenerator.default('resetear'),
          query: { email: email }
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
            <h1>Recuperar mi cuenta</h1>
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

                <div className="alert alert-info">
                  Para poder recuperar tu cuenta ingresa el e-mail con el que te
                  registraste, si no lo recuerdas puedes probar iniciando con
                  facebook directamente.
                </div>

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

                <div className="form-group">
                  <div className="center-container">
                    {!this.state.isLoading && (
                      <button type="submit" className="btn btn-lg btn-primary">
                        Recuperar Cuenta
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
                      to={RouteGenerator.default('resetear')}
                      className="btn btn-lg btn-default"
                    >
                      Ya tengo el código de recuperación
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
