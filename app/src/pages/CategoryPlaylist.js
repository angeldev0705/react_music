import React from 'react';
import { PageComponent } from '../base/Component';
import { Loading } from '../components/misc/Loading';
import { Icon } from '../components/misc/Icon';
import { ArtistInfo } from '../components/artist/ArtistInfo';
import { Toolbar } from '../components/base/Toolbar';
import { SongList } from '../components/song/SongList';
import { Request } from '../util/Request';
import { SEO } from '../util/SEO';
import { ImageUtil } from '../util/Util';
import { SEOCategoryPlaylist } from '../components/misc/SEO';
import { RouteGenerator } from '../util/RouteGenerator';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';
import PubSub from 'pubsub-js';

export class CategoryPlaylist extends PageComponent {
  state = {
    playlist: {},
    isLoading: true
  };

  handleScrollBinded = null;

  loadPlaylist(playlistSlug) {
    if (playlistSlug === this.state.playlist.slug) {
      return;
    }

    this.setState({ isLoading: true });
    Request.get(`category/playlists/slug/${playlistSlug}`, `category_playlists`)
      .then(data => {
        let playlist = data || {};

        this.setState({ playlist, isLoading: false }, () => {
          Analytics.pageview();
        });
      })
      .catch(err => {
        this.context.router.replace({
          pathname: RouteGenerator.search(playlistSlug.replace(/-/g, ' ')),
          query: this.props.params
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.playlist) {
      if (this.props.params.playlist !== nextProps.params.playlist) {
        this.loadPlaylist(nextProps.params.playlist);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let nextPlaylist = nextState.playlist || {};
    let update = false;
    if (nextPlaylist.id !== this.state.playlist.id) {
      update = true;
    } else if (nextState.isLoading !== this.state.isLoading) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (nextContext.isLandingActive !== this.context.isLandingActive) {
      update = true;
    }
    return update;
  }

  handleScroll() {
    let scrOfY = 0;
    if (typeof window.pageYOffset === 'number') {
      scrOfY = window.pageYOffset;
    } else if (document.body && document.body.scrollTop) {
      scrOfY = document.body.scrollTop;
    }
    //TODO hacer algo
    //console.log(scrOfY);
  }

  componentDidMount() {
    this.scrollTop();
    this.handleScroll();
    this.handleScrollBinded = this.handleScroll.bind(this);
    document.body.addEventListener('resize', this.handleResizeBinded);
    this.loadPlaylist(this.props.params.playlist);
  }

  componentWillMount() {
    PubSub.publish('onToggleLandingActive', true);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollBinded);
    PubSub.publish('onToggleLandingActive', false);
  }

  render() {
    let playlist = this.state.playlist || {};

    let style = {
      backgroundImage: 'url(' + ImageUtil.getImageUrl(playlist) + ')'
    };

    let containerClassName = 'landing-container';
    containerClassName += this.context.isLandingActive
      ? ' app-scrollable '
      : '';

    return (
      <div>
        <div className="landing-background" style={style} />

        {!this.context.isMobile && (
          <Toolbar item={playlist} parent="Explorar" type="category" />
        )}

        {this.state.isLoading && <Loading />}
        {!this.state.isLoading &&
          playlist && <DocumentMeta {...SEO.categoryPlaylist(playlist)} />}

        {!this.state.isLoading &&
          playlist.id && (
            <div className={containerClassName}>
              {this.context.isMobile && (
                <div className="page-title primary shadow">
                  <Icon
                    name="menu"
                    className="menu"
                    onTouchTap={this.toggleMenu.bind(this)}
                  />
                  <h1>{playlist.name}</h1>
                </div>
              )}

              {!this.context.isMobile && (
                <div className="landing-header">
                  <div className="col-sm-12">
                    <div className="profile">
                      <div className="image">
                        <img
                          src={ImageUtil.getImageUrl(playlist)}
                          alt={playlist.name}
                        />
                      </div>
                      <div className="info">
                        <span className="type">Playlist</span>
                        <h4 className="title">{playlist.name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {this.context.isMobile &&
                playlist.id && <ArtistInfo item={playlist} />}

              {!this.state.isLoading &&
                playlist && <SEOCategoryPlaylist playlist={playlist} />}

              {playlist.id && (
                <SongList
                  ref="songs"
                  layout={this.context.isMobile ? 'default' : 'middle'}
                  categoryPlaylistId={playlist.id}
                />
              )}
            </div>
          )}
      </div>
    );
  }
}
