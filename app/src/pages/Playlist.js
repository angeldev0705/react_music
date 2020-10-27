import React from 'react';
import { PageComponent } from '../base/Component';
import { RouteGenerator } from '../util/RouteGenerator';
import { Loading } from '../components/misc/Loading';
import { Icon } from '../components/misc/Icon';
import { Toolbar } from '../components/base/Toolbar';
import { RenamePlaylistModal } from '../components/playlist/RenamePlaylistModal';
import { SongList } from '../components/song/SongList';
import { Request } from '../util/Request';
import { SEO } from '../util/SEO';
import { Auth } from '../middleware/Auth';
import { ImageUtil } from '../util/Util';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';
import PubSub from 'pubsub-js';

export class Playlist extends PageComponent {
  static childContextTypes = {
    playlist: React.PropTypes.object
  };
  state = {
    playlist: {},
    isLoading: true,
    showRenameModal: false,
    editMode: false
  };

  getChildContext() {
    return {
      playlist: this.state.playlist
    };
  }

  loadData(id) {
    if (!id) {
      console.error('no hay id');
    }

    if (parseInt(id, 10) === parseInt(this.state.playlist.id, 10)) {
      return;
    }

    this.setState({ isLoading: true });
    Request.get(`playlist/${id}`, `playlist`, {}, { secure: true })
      .then(data => {
        this.setState({ playlist: data || {}, isLoading: false }, () => {
          Analytics.pageview();
        });
      })
      .catch(err => {
        this.context.router.replace({
          pathname: RouteGenerator.error(404),
          query: this.props.params
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id) {
      if (nextProps.params.id !== this.props.params.id) {
        this.loadData(nextProps.params.id);
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
    } else if (nextState.showRenameModal !== this.state.showRenameModal) {
      update = true;
    } else if (nextState.editMode !== this.state.editMode) {
      update = true;
    } else if (nextState.playlist !== this.state.playlist) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (nextContext.isLandingActive !== this.context.isLandingActive) {
      update = true;
    }
    return update;
  }

  componentDidMount() {
    //this.scrollTop();
    PubSub.publish('onToggleLandingActive', true);
    if (this.props.params.id) {
      this.loadData(this.props.params.id);
    }
  }

  componentWillUnmount() {
    PubSub.publish('onToggleLandingActive', false);
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  playSongs() {
    this.refs.songs.playAllSongs(0);
  }

  onDeleteSong(song) {
    let playlist = this.state.playlist;
    Request.delete(`playlist/${playlist.id}/song`, { id_song: song.id }, null, {
      secure: true
    })
      .then(data => {})
      .catch(err => {
        this.getNotificationCenter().addNotification({
          message: err.message || 'Error desconocido',
          level: 'warning',
          position: 'bc',
          autoDismiss: 2
        });
      })
      .then(() => {});
  }

  toggleRenameModal() {
    this.setState({ showRenameModal: !this.state.showRenameModal });
  }

  renamePlaylist(newPlaylist) {
    let playlist = this.state.playlist;
    playlist.name = newPlaylist.name || playlist.name;

    this.setState({ playlist: playlist });
  }

  render() {
    let playlist = this.state.playlist || {};
    let profile = Auth.getProfile() || {};
    let userPlaylist = playlist.user || {};
    let isEditable = userPlaylist.id === profile.id;

    let style = {
      backgroundImage: 'url(' + ImageUtil.getUserPhotoUrl(userPlaylist) + ')'
    };

    let containerClassName = 'landing-container';
    containerClassName += this.context.isLandingActive
      ? ' app-scrollable '
      : '';

    return (
      <div>
        <div className="landing-background" style={style} />

        {!this.context.isMobile && (
          <Toolbar item={playlist} parent="Playlists" type="playlist" />
        )}

        {this.state.isLoading && <Loading />}

        {!this.state.isLoading &&
          playlist && <DocumentMeta {...SEO.playlist(playlist)} />}

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

                  {this.context.isMobile &&
                    (playlist.id || song.id) && (
                      <div className="pull-right btn-group">
                        <button
                          className="btn btn-default"
                          onTouchTap={this.playSongs.bind(this)}
                        >
                          <Icon name="play_arrow" />
                          <span className="caption">Reproducir Canciones</span>
                        </button>

                        {isEditable && (
                          <button
                            className="btn btn-default"
                            onTouchTap={this.toggleEditMode.bind(this)}
                          >
                            <Icon name="edit" />
                            <span className="caption">Editar</span>
                          </button>
                        )}
                      </div>
                    )}
                  <h1>{playlist.name}</h1>
                </div>
              )}

              {this.state.showRenameModal && (
                <RenamePlaylistModal
                  onSuccess={this.renamePlaylist.bind(this)}
                  onHide={this.toggleRenameModal.bind(this)}
                />
              )}

              {!this.context.isMobile && (
                <div className="landing-header">
                  <div className="col-sm-12">
                    <div className="profile">
                      <div className="image">
                        <img
                          src={ImageUtil.getUserPhotoUrl(userPlaylist)}
                          alt={playlist.name}
                        />
                      </div>
                      <div className="info">
                        <span className="type">Playlist</span>
                        <h4 className="title">
                          {playlist.name}{' '}
                          {isEditable && (
                            <button
                              onTouchTap={this.toggleRenameModal.bind(this)}
                              className="btn btn-xs btn-primary"
                            >
                              <Icon name="edit" />
                            </button>
                          )}
                        </h4>
                        <div className="options btn-group">
                          <button
                            className="btn btn-default"
                            onTouchTap={this.playSongs.bind(this)}
                          >
                            <Icon name="play_arrow" /> Reproducir
                          </button>

                          {isEditable && (
                            <button
                              className={
                                'btn ' +
                                (this.state.editMode
                                  ? ' btn-primary '
                                  : ' btn-default ')
                              }
                              onTouchTap={this.toggleEditMode.bind(this)}
                            >
                              <Icon name="edit" /> Editar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="options hide">
                    <ul>
                      <li className="active">
                        <a onTouchTap={this.playSongs.bind(this)}>
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
              )}

              <SongList
                ref="songs"
                secure={true}
                onDeleteSong={this.onDeleteSong.bind(this)}
                editMode={this.state.editMode}
                layout={this.context.isMobile ? 'default' : 'middle'}
                playlistId={playlist.id}
              />
            </div>
          )}
      </div>
    );
  }
}
