import React from 'react';
import { PageComponent } from '../base/Component';
import { RouteGenerator } from '../util/RouteGenerator';
import { Tab, Tabs } from 'react-bootstrap';
import { Link } from '../components/misc/Link';
import { SongList } from '../components/song/SongList';
import { SEO } from '../util/SEO';
import { Analytics } from '../util/Analytics';
import { Icon } from '../components/misc/Icon';
import DocumentMeta from 'react-document-meta';

export class Songs extends PageComponent {
  state = {
    tabKey: 1
  };

  handleSelect = key => {
    let path = 'canciones';
    switch (key) {
      default:
      case 1:
        path += '';
        break;
      case 2:
        path += '/populares-hoy';
        break;
      case 3:
        path += '/populares-mes';
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
      case 'nuevas':
        key = 1;
        break;
      case 'populares-hoy':
        key = 2;
        break;
      case 'populares-mes':
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

  componentWillMount() {
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

  componentDidMount() {
    Analytics.pageview();
  }

  render() {
    let seo;
    switch (this.state.tabKey) {
      case 1:
      default:
        seo = SEO.simple('Musica Nueva Para Descargar');
        break;
      case 2:
        seo = SEO.simple('Populares de Hoy');
        break;
      case 3:
        seo = SEO.simple('Populares del Mes');
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
              <Link className="btn btn-default" to={RouteGenerator.search()}>
                <Icon name="search" />
                <span className="caption">Buscar</span>
              </Link>
            </div>
          )}
          <h1>Canciones</h1>
        </div>
        <Tabs
          animation={false}
          activeKey={this.state.tabKey}
          onSelect={this.handleSelect}
        >
          <Tab
            eventKey={1}
            title={this.context.isMobile ? 'Nuevas' : 'Nuevas Canciones'}
          >
            <SongList hideAds={this.state.tabKey !== 1} path={'song/recent'} />
          </Tab>
          <Tab eventKey={2} title="Top Hoy">
            <SongList
              hideAds={this.state.tabKey !== 2}
              isTop={false}
              path={'song/top_day'}
            />
          </Tab>
          <Tab eventKey={3} title="Top Mes">
            <SongList
              hideAds={this.state.tabKey !== 3}
              isTop={false}
              path={'song/top_month'}
            />
          </Tab>
        </Tabs>
        ​
      </div>
    );
  }
}
