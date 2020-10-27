import React from 'react';
import { Component } from '../../base/Component';
import { Config } from '../../Config';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Form, Input } from '../../components/misc/Form';
import { Loading } from '../../components/misc/Loading';
import { Link } from '../../components/misc/Link';
import { Request } from '../../util/Request';
import { Auth } from '../../middleware/Auth';
import { FacebookLoginButton } from './FacebookLoginButton';
import PubSub from 'pubsub-js';

export class Login extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    userProfile: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  state = { isLoading: false };

  handleSubmit(e) {
    e.preventDefault();

    let user = this.refs.user.getValue();
    let password = this.refs.password.getValue();

    this.setState({ isLoading: true });

    Request.post('account/login', {
      user: user,
      password: password
    })
      .then(data => {
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
      <div>
        <div className="col-sm-12">
          <Form
            onSubmit={this.handleSubmit.bind(this)}
            type="vertical"
            className="form-login"
          >
            {!this.context.isMobile && (
              <div className="logo">{Config.app.name}</div>
            )}

            <div className="form-group">
              <div className="center-container">
                <FacebookLoginButton />
              </div>
            </div>

            <hr />

            <Input
              type="text"
              required={true}
              ref="user"
              layout="rows"
              placeholder="Usuario"
              size="lg"
            />
            <Input
              type="password"
              required={true}
              ref="password"
              layout="rows"
              placeholder="Contraseña"
              size="lg"
            />

            <div className="form-group">
              <div className="center-container">
                {!this.state.isLoading && (
                  <button type="submit" className="btn btn-lg  btn-primary">
                    Iniciar Sesión
                  </button>
                )}
                {this.state.isLoading && (
                  <button
                    type="button"
                    disabled={true}
                    className="btn btn-lg btn-primary"
                  >
                    <Loading type="mini" />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="center-container">
                <FacebookLoginButton className="btn-default">
                  Registrarme
                </FacebookLoginButton>
              </div>
            </div>
            <div className="form-group">
              <div className="center-container">
                <Link
                  to={RouteGenerator.default('recuperar')}
                  className="btn btn-link btn-sm"
                >
                  Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
