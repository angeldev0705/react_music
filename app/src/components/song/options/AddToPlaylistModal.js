import React from 'react';
import { Component } from '../../../base/Component';
import { Request } from '../../../util/Request';
import { Icon } from '../../misc/Icon';
import { Modal } from '../../misc/Modal';
import { Loading } from '../../misc/Loading';
import { AddToPlaylistItem } from '../../playlist/AddToPlaylistItem';
import { CreatePlaylist } from '../../playlist/CreatePlaylist';

export class AddToPlaylistModal extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  static playlists;

  state = {
    playlists: [],
    isLoading: false,
    isLoadingStatus: false,
    songPlaylists: []
  };

  componentDidMount() {
    let item = this.context.song || {};

    if (!AddToPlaylistModal.playlists) {
      this.loadPlaylists();
    } else {
      this.setState({ playlists: AddToPlaylistModal.playlists });
    }

    this.checkSong();
  }

  checkSong() {
    let item = this.context.song || {};
    this.setState({ isLoadingStatus: true });
    Request.get(`user/playlists/${item.id}`, null, {}, { secure: true })
      .then(data => {
        let playlists = data.results || [];
        this.setState({ songPlaylists: playlists });
      })
      .catch(err => {})
      .then(data => {
        this.setState({ isLoadingStatus: false });
      });
  }

  loadPlaylists() {
    this.setState({ isLoading: true });
    Request.get('user/playlists', null, { limit: 100 }, { secure: true })
      .then(data => {
        let playlists = data.results || [];
        this.setState({ playlists: playlists });
        AddToPlaylistModal.playlists = playlists;
      })
      .catch(err => {})
      .then(data => {
        this.setState({ isLoading: false });
      });
  }

  isInPlaylist(playlist) {
    let playlists = this.state.songPlaylists || [];
    return playlists.some(songPlaylist => {
      return songPlaylist.id === playlist.id;
    });
  }

  onAddToPlaylist(playlist) {
    let songPlaylists = this.state.songPlaylists;
    songPlaylists.push(playlist);

    this.setState({ songPlaylists: songPlaylists });
  }

  onDeleteFromPlaylist(playlist) {
    let songPlaylists = this.state.songPlaylists;
    songPlaylists = songPlaylists.filter(songPlaylist => {
      return playlist.id !== songPlaylist.id;
    });

    this.setState({ songPlaylists: songPlaylists });
  }

  onCreate(playlist) {
    let playlists = [playlist, ...this.state.playlists];
    this.setState({ playlists: playlists }, () => {
      let playlistItem = this.refs[`playlist${playlist.id}`];
      if (playlistItem) {
        playlistItem.toggle();
      }
    });
  }

  render() {
    let item = this.context.song || {};

    return (
      <Modal
        className="add-to-playlist-modal"
        size="sm"
        onHide={this.props.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.props.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <div className="modal-header-options">
            <div className="btn-group  btn-group-xs">
              <button
                onTouchTap={this.loadPlaylists.bind(this)}
                className=" btn btn-xs btn-link"
                title="Recargar Playlists"
              >
                <Icon name="loop" />
              </button>
            </div>
          </div>
          <h4 className="modal-title">Agregar a Playlist</h4>
        </div>
        <div className="modal-body">
          <CreatePlaylist onCreate={this.onCreate.bind(this)} />

          {this.state.isLoading && <Loading />}
          {!this.state.isLoading && (
            <ul className="add-to-playlist-list">
              {!this.state.isLoading &&
                this.state.playlists &&
                this.state.playlists.map(playlist => {
                  let isAdded = this.isInPlaylist(playlist);

                  return (
                    <AddToPlaylistItem
                      key={playlist.id}
                      ref={'playlist' + playlist.id}
                      onAdd={this.onAddToPlaylist.bind(this)}
                      onDelete={this.onDeleteFromPlaylist.bind(this)}
                      playlist={playlist}
                      isLoadingStatus={this.state.isLoadingStatus}
                      isAdded={isAdded}
                    />
                  );
                })}
            </ul>
          )}
        </div>
      </Modal>
    );
  }
}
