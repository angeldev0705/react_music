import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Auth } from '../../middleware/Auth';
import { Icon } from '../../components/misc/Icon';
import { Loading } from '../../components/misc/Loading';
import DocumentMeta from 'react-document-meta';

export class Logout extends PageComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired
  };

  componentDidMount() {
    Auth.logout(() => {
      this.getPlayer().clearFavourites();
      this.context.router.push({ pathname: RouteGenerator.homepage() });
    });
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
            <h1>Cerrando sesión</h1>
          </div>
        )}
        <div className="home">
          <div className="home-container">
            <div className="center">Cerrando Sesión</div>
            <div className="center">
              <Loading />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
