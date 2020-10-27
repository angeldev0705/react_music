import React from 'react';
import { PageComponent } from '../base/Component';
import { RouteGenerator } from '../util/RouteGenerator';
import { Tab, Tabs } from 'react-bootstrap';
import { Link } from '../components/misc/Link';
import { ArtistList } from '../components/artist/ArtistList';
import { SEO } from '../util/SEO';
import { Analytics } from '../util/Analytics';
import { Icon } from '../components/misc/Icon';
import DocumentMeta from 'react-document-meta';

export class Artists extends PageComponent {
  state = {
    tabKey: 1
  };

  handleSelect = key => {
    let path = 'artistas';
    switch (key) {
      default:
      case 1:
        path += '';
        break;
      case 2:
        path += '/populares';
        break;
      case 3:
        path += '/nuevos';
        break;
    }

    this.context.router.replace({ pathname: RouteGenerator.default(path) });
  };

  chooseTab = routes => {
    let lastPath =
      routes && routes[routes.length - 1] ? routes[routes.length - 1].path : '';

    let key;
    switch (lastPath) {
      default:
      case 'tendencia':
        key = 1;
        break;
      case 'populares':
        key = 2;
        break;
      case 'nuevos':
        key = 3;
        break;
    }

    this.scrollTop();
    if (key !== this.state.tabKey) {
      this.setState({ tabKey: key });
    }
  };

  componentWillReceiveProps(nextProps) {
    let routes = nextProps.routes;
    this.chooseTab(routes);
  }

  componentDidMount() {
    Analytics.pageview();
    this.chooseTab(this.props.routes);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    if (nextState.tabKey !== this.state.tabKey) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    }
    return update;
  }

  render() {
    let seo;
    switch (this.state.tabKey) {
      case 1:
      default:
        seo = SEO.simple(
          'Artistas',
          'Descarga musica gratis de artistas populares en Descargar Musica'
        );
        break;
      case 2:
        seo = SEO.simple(
          'Artistas Populares',
          'Descarga musica gratis de artistas populares en Descargar Musica'
        );
        break;
      case 3:
        seo = SEO.simple(
          'Artistas Nuevos',
          'Descarga musica gratis de artistas nuevos en Descargar Musica'
        );
        break;
    }

    return (
      <div>
        <DocumentMeta {...seo} />
        <div className="page-title primary">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />
          {this.context.isMobile && (
            <div className="pull-right btn-group">
              <Link
                className="btn btn-default"
                to={RouteGenerator.searchArtists()}
              >
                <Icon name="search" />
                <span className="caption">Buscar</span>
              </Link>
            </div>
          )}
          {this.context.isMobile && <h1>Artistas</h1>}
          {!this.context.isMobile && <h1>Artistas Populares</h1>}
        </div>
        <Tabs
          animation={false}
          activeKey={this.state.tabKey}
          onSelect={this.handleSelect}
        >
          <Tab
            eventKey={1}
            title={
              this.context.isMobile ? 'Tendencia' : 'Artistas en Tendencia'
            }
          >
            <ArtistList
              hideAds={this.state.tabKey !== 1}
              path={'artist/trends'}
            />
          </Tab>
          <Tab
            eventKey={2}
            title={this.context.isMobile ? 'Populares' : 'Artistas Populares'}
          >
            <ArtistList hideAds={this.state.tabKey !== 2} path={'artist/top'} />
          </Tab>
          <Tab
            eventKey={3}
            title={this.context.isMobile ? 'Nuevos' : 'Artistas Nuevos'}
          >
            <ArtistList
              hideAds={this.state.tabKey !== 3}
              path={'artist/recent'}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
