import React from 'react';
import { PageComponent } from '../base/Component';
import { Config } from '../Config';
import { ArtistList } from '../components/artist/ArtistList';
import { SongList } from '../components/song/SongList';
import { RouteGenerator } from '../util/RouteGenerator';
import { Link } from '../components/misc/Link';
import { Icon } from '../components/misc/Icon';
import { SEOHome } from '../components/misc/SEO';
import { Ads } from '../components/ads/Ads';
import { Analytics } from '../util/Analytics';
import { SEO } from '../util/SEO';
import { SEOUtil } from '../util/Util';
import DocumentMeta from 'react-document-meta';

export class Home extends PageComponent {
  static listener = null;
  state = {
    hideHeader: false
  };

  handleScrollBinded = null;

  search(event) {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    let query = event.target.value;

    this.listener = setTimeout(() => {
      if (query && query.length > 0) {
        this.context.router.push({ pathname: RouteGenerator.search(query) });
      }
    }, 300);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;

    if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (nextState.hideHeader !== this.state.hideHeader) {
      update = true;
    } else if (nextState.showAds !== this.state.showAds) {
      update = true;
    }

    return update;
  }

  resultsDidLoaded(results) {
    if (!this.context.isMobile) {
      //FIXME verificar si tiene canciones primero
      //this.getPlayer().add(results,true);
    }
  }

  handleScroll() {
    let scrOfY = 0;
    if (typeof window.pageYOffset === 'number') {
      scrOfY = window.pageYOffset;
    } else if (document.body && document.body.scrollTop) {
      scrOfY = document.body.scrollTop;
    }

    let hideHeader = scrOfY > 130 ? true : false;
    if (this.state.hideHeader !== hideHeader) {
      this.setState({ hideHeader: hideHeader });
    }
  }

  componentDidMount() {
    this.scrollTop();
    Analytics.pageview();

    this.handleScroll();
    this.handleScrollBinded = this.handleScroll.bind(this);
    document.addEventListener('scroll', this.handleScrollBinded);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollBinded);
  }

  render() {
    let headerClass = 'page-title primary ';
    headerClass += this.state.hideHeader ? ' shadow ' : '';

    return (
      <div>
        <DocumentMeta {...SEO.default()} />
        <div className="home">
          <div className="home-container">
            <div className={headerClass}>
              <Icon
                name="menu"
                className="menu"
                onTouchTap={this.toggleMenu.bind(this)}
              />
              {this.context.isMobile && (
                <div className="pull-right btn-group">
                  <Link
                    className="btn btn-default"
                    to={RouteGenerator.search()}
                  >
                    <Icon name="search" />
                    <span className="caption">Buscar</span>
                  </Link>
                </div>
              )}
              {this.context.isMobile && <h1>{Config.app.name}</h1>}
              {!this.context.isMobile && (
                <h1>
                  <div className="logo-text" />
                </h1>
              )}
            </div>

            <SEOHome />

            {!this.context.isMobile && (
              <div className="search-container">
                <input
                  type="text"
                  ref="query"
                  onChange={this.search.bind(this)}
                  className="form-control active input-lg search-control"
                  placeholder="Buscar artista o canción"
                />
              </div>
            )}
            <div className="home-top">
              {Config.ads.enabled &&
                !SEOUtil.isSEORequest() &&
                this.context.isMobile && <Ads size="320x50" />}
              <div className="col-sm-12">
                {Config.ads.enabled &&
                  !SEOUtil.isSEORequest() &&
                  !this.context.isMobile && (
                    <div className="row">
                      <div className="col-sm-12">
                        <Ads size="728x90" />
                      </div>
                    </div>
                  )}
                <div className="row">
                  <div className="col-sm-12 page-subtitle">
                    <div className="pull-right btn-group">
                      <button
                        className="btn btn-default"
                        onTouchTap={() => {
                          this.refs.songs.playAllSongs(0);
                        }}
                      >
                        <Icon name="play_arrow" />
                        <span className="caption">Reproducir Todas</span>
                      </button>
                      <Link
                        to={RouteGenerator.songs()}
                        className="btn btn-default"
                      >
                        <Icon name="audiotrack" />
                        <span className="caption">Ver Todas</span>
                      </Link>
                    </div>

                    <h3>Canciones Nuevas</h3>
                  </div>
                  <SongList
                    ref="songs"
                    hideAds={true}
                    onResultsDidLoaded={this.resultsDidLoaded.bind(this)}
                    path={'song/recent?limit=10'}
                  />
                </div>
              </div>

              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12 page-subtitle">
                    <div className="pull-right btn-group">
                      <Link
                        to={RouteGenerator.artists()}
                        className="btn btn-default"
                      >
                        <Icon name="album" />
                        <span className="caption">Ver Todos</span>
                      </Link>
                    </div>
                    <h3>Artistas Populares</h3>
                  </div>

                  <ArtistList hideAds={true} path={'artist/top?limit=6'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
