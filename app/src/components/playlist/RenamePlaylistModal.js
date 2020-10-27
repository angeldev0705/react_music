import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from '../misc/Icon';
import { Modal } from '../misc/Modal';
import { RenamePlaylist } from './RenamePlaylist';

export class RenamePlaylistModal extends Component {
  onSuccess(playlist) {
    if (typeof this.props.onSuccess === 'function') {
      this.props.onSuccess(playlist);
    }
    if (typeof this.props.onHide === 'function') {
      this.props.onHide();
    }
  }

  render() {
    return (
      <Modal
        className="rename-to-playlist-modal"
        size="sm"
        onHide={this.props.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.props.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <h4 className="modal-title">Renombrar Playlist</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <RenamePlaylist onSuccess={this.onSuccess.bind(this)} />
          </div>
        </div>
      </Modal>
    );
  }
}
