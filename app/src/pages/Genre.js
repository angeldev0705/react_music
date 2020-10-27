import React from 'react';
import { PageComponent } from '../base/Component';
import { RouteGenerator } from '../util/RouteGenerator';
import { Icon } from '../components/misc/Icon';
import { Tab, Tabs } from 'react-bootstrap';
import { ArtistList } from '../components/artist/ArtistList';
import { SongList } from '../components/song/SongList';
import { Request } from '../util/Request';
import { SEO } from '../util/SEO';
import { SEOGenre } from '../components/misc/SEO';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';

export class Genre extends PageComponent {
  state = {
    tabKey: 1,
    genre: {}
  };

  handleSelect = key => {
    let path = RouteGenerator.genre(this.state.genre);
    switch (key) {
      default:
      case 1:
        path += '';
        break;
      case 2:
        path += '/canciones';
        break;
    }

    this.context.router.replace({ pathname: path });
  };

  chooseTab = routes => {
    let lastPath =
      routes && routes[routes.length - 1] ? routes[routes.length - 1].path : '';

    let key;
    switch (lastPath) {
      default:
      case 'aristas':
        key = 1;
        break;
      case 'canciones':
        key = 2;
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
    Request.get(`genre/slug/${this.props.params.genre}`)
      .then(data => {
        this.setState({ genre: data || {} }, () => {
          Analytics.pageview();
        });

        this.chooseTab(this.props.routes);
      })
      .catch(err => {
        let genre = this.props.params.genre || '';
        this.context.router.replace({
          pathname: RouteGenerator.search(genre.replace(/-/g, ' ')),
          query: this.props.params
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    let genre = nextState.genre || {};
    if (nextState.tabKey !== this.state.tabKey) {
      update = true;
    } else if (genre.id !== this.state.genre.id) {
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
        seo = SEO.genre(this.state.genre, 'artists');
        break;
      case 2:
        seo = SEO.genre(this.state.genre, 'songs');
        break;
    }
    return (
      <div>
        {this.state.genre && this.state.genre.id && <DocumentMeta {...seo} />}

        <div>
          <div className="page-title primary">
            <Icon
              name="menu"
              className="menu"
              onTouchTap={this.toggleMenu.bind(this)}
            />

            {this.state.genre.id && (
              <div className="pull-right btn-group">
                <button
                  className="btn btn-default"
                  onTouchTap={() => {
                    this.refs.songs.playAllSongs(0);
                  }}
                >
                  <Icon name="play_arrow" />
                  <span className="caption">Reproducir Canciones</span>
                </button>
              </div>
            )}
            {this.context.isMobile && <h1>{this.state.genre.name}</h1>}
            {!this.context.isMobile && (
              <h1>Descargar musica {this.state.genre.name}</h1>
            )}
          </div>
        </div>

        {this.state.genre &&
          this.state.genre.id && <SEOGenre genre={this.state.genre} />}

        <Tabs
          animation={false}
          activeKey={this.state.tabKey}
          onSelect={this.handleSelect}
        >
          <Tab eventKey={1} title="Artistas">
            {this.state.genre.id && (
              <ArtistList
                hideAds={this.state.tabKey !== 1}
                genreId={this.state.genre.id}
              />
            )}
          </Tab>
          <Tab eventKey={2} title="Canciones">
            {this.state.genre.id && (
              <SongList
                hideAds={this.state.tabKey !== 2}
                ref="songs"
                genreId={this.state.genre.id}
              />
            )}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
