import React from 'react';
import { PageComponent } from '../base/Component';
import { Loading } from '../components/misc/Loading';
import { Icon } from '../components/misc/Icon';
import { ArtistInfo } from '../components/artist/ArtistInfo';
import { ArtistFollow } from '../components/artist/ArtistFollow';
import { Toolbar } from '../components/base/Toolbar';
import { SongList } from '../components/song/SongList';
import { Request } from '../util/Request';
import { SEO } from '../util/SEO';
import { ImageUtil } from '../util/Util';
import { SEOArtist, SEOSong } from '../components/misc/SEO';
import { RouteGenerator } from '../util/RouteGenerator';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';
import PubSub from 'pubsub-js';

export class Artist extends PageComponent {
  state = {
    artist: {},
    song: {},
    isLoading: true
  };

  handleScrollBinded = null;

  loadSong(artistSlug, songSlug) {
    if (!songSlug || !artistSlug) {
      console.error('no hay slug');
    }

    if (
      artistSlug === this.state.artist.slug &&
      songSlug === this.state.song.slug
    ) {
      return;
    }

    this.setState({ isLoading: true });
    Request.get(`song/slug/${artistSlug}/${songSlug}`, `artist_song`)
      .then(data => {
        let song = data || {};
        let artists = data.artists || [];
        let artist = {};
        artists.forEach((value, index) => {
          if (value.slug === artistSlug) {
            artist = value;
            return;
          }
        });

        this.setState({ song: song, artist: artist, isLoading: false }, () => {
          Analytics.pageview();
        });

        if (this.context.isMobile) {
          this.getPlayer().add([song], false);
        } else {
          this.getPlayer().addAndPlay([song], 0, false);
        }
      })
      .catch(err => {
        this.context.router.replace({
          pathname: RouteGenerator.artist({ slug: artistSlug }),
          query: { song: songSlug }
        });
      });
  }

  loadArtist(artistSlug) {
    if (!artistSlug) {
      console.error('no hay slug');
    }

    if (artistSlug === this.state.artist.slug) {
      return;
    }

    this.setState({ isLoading: true });
    Request.get(`artist/slug/${artistSlug}`, `artist`)
      .then(data => {
        this.setState({ artist: data || {}, isLoading: false }, () => {
          Analytics.pageview();
        });
      })
      .catch(err => {
        let pathname = RouteGenerator.genre({ slug: artistSlug });
        if (artistSlug.indexOf('http') !== -1) {
          pathname = RouteGenerator.homepage();
        }

        this.context.router.replace({
          pathname
        });
      });
  }

  resultsDidLoaded(results) {
    //if (this.state.song.id) {
    //    results.forEach((song, index)=> {
    //        if (song.id === this.state.song.id) {
    //            this.getPlayer().addAndPlay(results, index, true);
    //            return;
    //        }
    //    });
    //}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.song) {
      if (
        this.props.params.song !== nextProps.params.song &&
        this.props.params.artist !== nextProps.params.artist
      ) {
        this.loadSong(nextProps.params.artist, nextProps.params.song);
      }
    } else if (nextProps.params.artist) {
      if (
        this.props.params.artist !== nextProps.params.artist ||
        this.props.params.song
      ) {
        this.loadArtist(nextProps.params.artist);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let nextArtist = nextState.artist || {};
    let nextSong = nextState.song || {};
    let update = false;
    if (nextArtist.id !== this.state.artist.id) {
      update = true;
    } else if (nextSong.id !== this.state.song.id) {
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
    if (this.props.params.song) {
      this.loadSong(this.props.params.artist, this.props.params.song);
    } else {
      this.loadArtist(this.props.params.artist);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollBinded);
    PubSub.publish('onToggleLandingActive', false);
  }

  render() {
    let artist = this.state.artist || {};
    let song = this.state.song || {};

    //<div>
    //    {song.id && <h1>Descargar {song.name} de {Util.getArtists(song)}</h1>}
    //    {!song.id && <h1>Descargar musica de {artist.name}</h1>}
    //</div>

    let style = {
      backgroundImage: 'url(' + ImageUtil.getImageUrl(artist) + ')'
    };

    let containerClassName = 'landing-container';
    containerClassName += this.context.isLandingActive
      ? ' app-scrollable '
      : '';

    return (
      <div>
        <div className="landing-background" style={style} />

        {!this.context.isMobile && (
          <Toolbar item={artist} parent="Artistas" type="artist" />
        )}

        {this.state.isLoading && <Loading />}
        {!this.state.isLoading &&
          artist &&
          !song.id && <DocumentMeta {...SEO.artist(artist)} />}
        {!this.state.isLoading &&
          artist &&
          song.id && <DocumentMeta {...SEO.song(song)} />}

        {!this.state.isLoading &&
          artist.id && (
            <div className={containerClassName}>
              {this.context.isMobile && (
                <div className="page-title primary shadow">
                  <Icon
                    name="menu"
                    className="menu"
                    onTouchTap={this.toggleMenu.bind(this)}
                  />

                  {this.context.isMobile &&
                    (artist.id || song.id) && (
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

                  <h1>{artist.name}</h1>
                </div>
              )}

              {!this.context.isMobile && (
                <div className="landing-header">
                  <div className="col-sm-12">
                    <div className="profile">
                      <div className="image">
                        <img
                          src={ImageUtil.getImageUrl(artist)}
                          alt={artist.name}
                        />
                      </div>
                      <div className="info">
                        <span className="type">Artista</span>
                        <h4 className="title">{artist.name}</h4>
                        <div className="options btn-group">
                          <button
                            className="btn btn-default"
                            onTouchTap={() => {
                              this.refs.songs.playAllSongs(0);
                            }}
                          >
                            <Icon name="play_arrow" /> Reproducir
                          </button>

                          <ArtistFollow item={artist} />
                        </div>
                      </div>
                    </div>
                    <div className="options hide">
                      <ul>
                        <li className="active">
                          <a
                            onTouchTap={() => {
                              this.refs.songs.playAllSongs(0);
                            }}
                          >
                            <Icon name="play_arrow" /> Canciones
                          </a>
                        </li>
                        <li>
                          <a href="">
                            <Icon name="library_add" /> Albumes
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {this.context.isMobile &&
                artist.id && <ArtistInfo item={artist} />}

              {!this.state.isLoading &&
                artist &&
                !song.id && <SEOArtist artist={artist} />}
              {!this.state.isLoading &&
                artist &&
                song.id && <SEOSong song={song} />}

              <SongList
                ref="songs"
                layout={this.context.isMobile ? 'default' : 'middle'}
                onResultsDidLoaded={this.resultsDidLoaded.bind(this)}
                artistId={artist.id}
              />
            </div>
          )}
      </div>
    );
  }
}
