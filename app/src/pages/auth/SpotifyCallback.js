import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { Icon } from '../../components/misc/Icon';
import DocumentMeta from 'react-document-meta';
import { Request } from '../../util/Request';
import PubSub from 'pubsub-js';
import { Loading } from '../../components/misc/Loading';
import { Alert } from '../../components/misc/Alert';
import { Config } from '../../Config';
import { RouteGenerator } from '../../util/RouteGenerator';

export class AuthSpotifyCallback extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired
  };

  state = {
    isLoading: true,
    success: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.subscriber = PubSub.subscribe(
      'onSuccessLogin',
      this.checkIsLogged.bind(this)
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkIsLogged() {
    this.connect();
  }

  connect() {
    let params = this.context.router.location.query || {};
    let { data, error } = { ...params };

    if (data) {
      data = JSON.parse(data);
    }

    data = data || {};
    this.setState({ data });

    let paramsData = {};
    Object.keys(data).map(key => {
      paramsData[`spotify_${key}`] = data[key];
    });

    if (error) {
      this.setState({ isLoading: false });
      return;
    }

    this.setState({ isLoading: true });

    Request.post('account/spotify/connect', paramsData, null, { secure: true })
      .then(response => {
        let success = false;
        if (response && response.code === 200) {
          success = true;
        }
        return success;
      })
      .catch(e => {
        __DEV__ && console.log(e);
        return false;
      })
      .then(success => {
        this.setState({ success, isLoading: false });

        if (success) {
          this.context.router.replace({
            pathname: RouteGenerator.default('cuenta'),
            query: { spotify: true }
          });
        }
      });
  }

  render() {
    let { isLoading, success } = this.state;
    const connectUrl = Config.server.url + '/account/spotify/oauth_login';

    return (
      <div>
        <DocumentMeta {...SEO.default()} />

        <div className="page-title primary shadow">
          {this.context.isMobile && (
            <Icon
              name="menu"
              className="menu"
              onTouchTap={this.toggleMenu.bind(this)}
            />
          )}
          <h1>Conectando con Spotify</h1>
        </div>
        <div className="home">
          <div className="home-container">
            {isLoading && <Loading />}
            {!isLoading &&
              success && (
                <div>
                  <div className="center">Cuenta vinculada correctamente</div>

                  <div className="center">Redirigiendo...</div>
                </div>
              )}
            {!isLoading &&
              !success && (
                <div>
                  <Alert message="Ocurrio un error al conectar con Spotify" />

                  <button
                    className="btn btn-default"
                    onTouchTap={() => {
                      window.location.href = connectUrl;
                    }}
                  >
                    Conectar nuevamente
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}
