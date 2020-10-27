import React from 'react';
import ReactDOM from 'react-dom';
import { PageComponent } from '../base/Component';
import { RouteGenerator } from '../util/RouteGenerator';
import { Tab, Tabs } from 'react-bootstrap';
import { SongList } from '../components/song/SongList';
import { ArtistList } from '../components/artist/ArtistList';
import { SEO } from '../util/SEO';
import { Analytics } from '../util/Analytics';
import { Alert } from '../components/misc/Alert';
import { Icon } from '../components/misc/Icon';
import DocumentMeta from 'react-document-meta';

export class Search extends PageComponent {
  static listener = null;

  state = {
    tabKey: 1,
    query: ''
  };

  handleSelect(key) {
    let path = RouteGenerator.search(this.state.query);
    switch (key) {
      default:
      case 1:
        path += '';
        break;
      case 2:
        path += '/artistas';
        break;
    }

    this.context.router.replace({ pathname: path });
  }

  chooseTab(routes) {
    let lastPath =
      routes && routes[routes.length - 1] ? routes[routes.length - 1].path : '';

    let key;
    switch (lastPath) {
      default:
      case 'canciones':
        key = 1;
        break;
      case 'artistas':
        key = 2;
        break;
    }

    this.scrollTop();
    if (key !== this.state.tabKey) {
      this.setState({ tabKey: key });
    }
  }

  search(event) {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    let query = event.target.value;
    this.listener = setTimeout(() => {
      if (query && query.length > 0) {
        let route =
          this.state.tabKey === 2
            ? RouteGenerator.searchArtists(query)
            : RouteGenerator.search(query);
        this.context.router.replace({ pathname: route });
      } else {
        this.setState({ query: '' });
      }
    }, 450);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params && nextProps.params.query) {
      if (nextProps.params.query !== this.props.params.query) {
        this.setState({
          query: nextProps.params.query
        });
      }
    }

    let routes = nextProps.routes;
    this.chooseTab(routes);
  }

  componentDidMount() {
    this.setState({
      query: this.props.params.query
    });

    Analytics.pageview();
    this.chooseTab(this.props.routes);

    let query = ReactDOM.findDOMNode(this.refs.query);
    if (this.props.params.query) {
      query.value = this.props.params.query;
      query.focus();
    } else {
      query.focus();
    }
  }

  clearFocus(e) {
    e.preventDefault();
    //let query = ReactDOM.findDOMNode(this.refs.query);
    //query.select();
    let query = ReactDOM.findDOMNode(this.refs.query);
    query.blur();

    return false;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    if (nextState.tabKey !== this.state.tabKey) {
      update = true;
    } else if (nextState.query !== this.state.query) {
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
        seo = SEO.search(this.state.query, 'songs');
        break;
      case 2:
        seo = SEO.search(this.state.query, 'artists');
        break;
      case 3:
        seo = SEO.default();
        break;
    }

    let headerClass = 'page-title primary';
    headerClass += this.state.query ? '' : ' shadow';

    return (
      <div>
        <DocumentMeta {...seo} />
        <div className={headerClass}>
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />

          <div className=" search-container">
            <form onSubmit={this.clearFocus.bind(this)}>
              <input
                type="text"
                ref="query"
                onChange={this.search.bind(this)}
                className="form-control active input-lg search-control"
                placeholder="Buscar artista o canción"
              />
            </form>
          </div>
        </div>
        {this.state.query && (
          <Tabs
            ref="results"
            animation={false}
            activeKey={this.state.tabKey}
            onSelect={this.handleSelect.bind(this)}
          >
            <Tab eventKey={1} title="Canciones">
              <SongList
                hideAds={this.state.tabKey !== 1}
                query={this.state.query}
              />
            </Tab>
            <Tab eventKey={2} title="Artistas">
              <ArtistList
                hideAds={this.state.tabKey !== 2}
                query={this.state.query}
              />
            </Tab>
          </Tabs>
        )}
        ​
        {!this.state.query && (
          <Alert
            type="info"
            message="Busca por artista, canción o la letra de la canción"
          />
        )}
      </div>
    );
  }
}
