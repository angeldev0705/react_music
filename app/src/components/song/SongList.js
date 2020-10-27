import React from 'react';
import { ListComponent } from '../base/ListComponent';
import { SongItem } from './SongItem';
import { SongMobileItem } from './SongMobileItem';
import { Loading } from '../misc/Loading';
import { Empty } from '../misc/Empty';
import { Icon } from '../misc/Icon';
import { Ads } from '../ads/Ads';
import { Config } from '../../Config';
import { Auth } from '../../middleware/Auth';
import { SEOUtil } from '../../util/Util';
import { Request } from '../../util/Request';
import PubSub from 'pubsub-js';
import { AdsFlexible } from '../ads/AdsFlexible';

export class SongList extends ListComponent {
  static contextTypes = {
    userProfile: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired,
    isMobile: React.PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onSuccessLogin',
      this.checkIsLogged.bind(this)
    );
    super.componentDidMount();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
    super.componentWillUnmount();
  }

  loadData(preProps) {
    let props = preProps || this.props;
    let path = '';
    let tmpParams = props.params || {};
    let params = { ...tmpParams };
    let config = {};
    let id;
    if (props.genreId) {
      path = `genre/${props.genreId}/songs`;
      id = 'genre_songs';
    } else if (props.artistId) {
      path = `artist/${props.artistId}/songs`;
      id = 'artist_songs';
    } else if (props.categoryPlaylistId) {
      path = `category/playlists/${props.categoryPlaylistId}/songs`;
      id = 'category_playlists_songs';
    } else if (props.playlistId) {
      path = `playlist/${props.playlistId}/songs`;
      id = 'playlist_songs';
    } else if (props.query) {
      path = `song/filter?query=${props.query}`;
      id = 'search_songs';
    }

    config.secure = !!props.secure;

    return this.loadDataFromPath(path, id, params, config).then(data => {
      this.checkFavourites(data.results);
    });
  }

  checkIsLogged(name, data = {}) {
    if (this.state.isPendingLogged) {
      this.checkFavourites(this.state.results);
    }
  }

  checkFavourites(results) {
    //FIXME corregir
    //        let userProfile = this.context.userProfile || {};
    //        if (!userProfile.id) {
    //            this.setState({isPendingLogged: true});
    //            return;
    //        }
    if (!Auth.isLoggedIn()) {
      this.setState({ isPendingLogged: true });
      return;
    }

    if (!results) {
      return;
    }

    let ids = [];
    results.forEach(song => {
      ids.push(song.id);
    });

    let favouriteSongs = this.getPlayer().state.favourites || [];

    ids = ids.filter(id => {
      return favouriteSongs.indexOf(id) === -1;
    });

    if (ids.length > 0) {
      Request.get(
        'user/favourite_songs/check',
        null,
        { ids: ids.join(',') },
        { secure: true }
      ).then(data => {
        this.getPlayer().addFavourites(data.results || []);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let loadAgain = false;
    if (nextProps.query !== this.props.query) {
      loadAgain = true;
    } else if (nextProps.genreId !== this.props.genreId) {
      loadAgain = true;
    } else if (nextProps.artistId !== this.props.artistId) {
      loadAgain = true;
    } else if (nextProps.playlistId !== this.props.playlistId) {
      loadAgain = true;
    } else if (nextProps.categoryPlaylistId !== this.props.categoryPlaylistId) {
      loadAgain = true;
    } else if (nextProps.page !== this.props.page) {
      loadAgain = true;
    } else if (nextProps.path !== this.props.path) {
      loadAgain = true;
    } else if (nextProps.secure !== this.props.secure) {
      loadAgain = true;
    } else if (nextProps.params !== this.props.params) {
      loadAgain = true;
    }

    if (loadAgain) {
      this.loadData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    //        let prevUserProfile = nextContext.userProfile || {};
    //        let userProfile = this.context.userProfile || {};

    let update = false;
    if (nextState.isLoading !== this.state.isLoading) {
      update = true;
    } else if (nextState.results !== this.state.results) {
      update = true;
    } else if (nextProps.editMode !== this.props.editMode) {
      update = true;
    } else if (nextProps.hideAds !== this.props.hideAds) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (
      nextState.isLoadingFavourites !== this.state.isLoadingFavourites
    ) {
      update = true;
    }
    //        else if (userProfile.id !== prevUserProfile.id) {
    //            update = true;
    //        }

    return update;
  }

  onPlayAllSongs(index) {
    this.playAllSongs(index);
  }

  playAllSongs(index) {
    this.getPlayer().addAndPlay(this.state.results, index, true);
  }

  deleteSong(index) {
    if (!this.state.results[index]) {
      return;
    }

    let song = this.state.results[index];

    let results = this.state.results.filter((data, elementIndex) => {
      return index !== elementIndex;
    });

    this.setState({ results: results }, () => {
      if (typeof this.props.onDeleteSong === 'function') {
        this.props.onDeleteSong(song);
      }
    });
  }

  render() {
    let songListContainerClassname = 'row song-list-container ';
    switch (this.props.layout) {
      case 'middle':
        songListContainerClassname += ' middle';
        break;
    }

    return (
      <div>
        {Config.ads.enabled &&
          !this.props.hideAds &&
          !SEOUtil.isSEORequest() &&
          this.context.isMobile && <Ads size="320x50" />}
        <div className="col-sm-12">
          {Config.ads.enabled &&
            !this.props.hideAds &&
            !this.props.hideTopAds &&
            !SEOUtil.isSEORequest() &&
            !this.context.isMobile && (
              <div className="row">
                <AdsFlexible size="728x90" itemSize={728} width />
              </div>
            )}

          <div className={songListContainerClassname}>
            {!this.state.isLoading &&
              !this.context.isMobile &&
              this.state.results.length > 0 && (
                <div>
                  <table className="table table-responsive song-list">
                    <thead>
                      <tr>
                        {this.props.editMode && <th className="delete" />}
                        {!this.props.editMode && <th className="addAll" />}
                        <th className="add hidden-xs" />
                        <th className="favourite hidden-xs" />

                        <th className="song">Nombre</th>
                        <th className="artist">Artista</th>
                        <th className="length hidden-xs">Duración</th>
                        {this.props.isTop && (
                          <th className="listens hidden-xs hidden-sm">
                            Reproducciones
                          </th>
                        )}

                        <th className="download hidden-xs hidden-sm">
                          <Icon title="Descargar" name="cloud_download" />
                        </th>

                        <th className="options" />
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.results.map((item, index) => (
                        <SongItem
                          key={index}
                          isTop={this.props.isTop}
                          editMode={this.props.editMode}
                          onDelete={this.deleteSong.bind(this, index)}
                          onPlayAllSongs={this.onPlayAllSongs.bind(this, index)}
                          index={index}
                          item={item}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            {Config.ads.enabled &&
              !this.props.hideAds &&
              !SEOUtil.isSEORequest() &&
              !this.context.isMobile && <Ads size="160x600" />}
            {!this.state.isLoading &&
              this.context.isMobile &&
              this.state.results.length > 0 && (
                <div className="song-list">
                  {this.state.results.map((item, index) => (
                    <SongMobileItem
                      key={index}
                      isTop={this.props.isTop}
                      editMode={this.props.editMode}
                      onDelete={this.deleteSong.bind(this, index)}
                      onPlayAllSongs={this.onPlayAllSongs.bind(this, index)}
                      index={index}
                      item={item}
                    />
                  ))}
                </div>
              )}

            {this.state.isLoading && <Loading />}
            {!this.state.isLoading &&
              this.state.results.length === 0 && (
                <Empty message="No se encontraron canciones" />
              )}
          </div>
        </div>
      </div>
    );
  }
}
