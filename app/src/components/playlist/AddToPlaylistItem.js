import React from 'react';
import { Component } from '../../base/Component';
import { Request } from '../../util/Request';
import { Icon } from '../misc/Icon';
import { Loading } from '../misc/Loading';

export class AddToPlaylistItem extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  state = {
    isLoading: false
  };

  toggle() {
    let playlist = this.props.playlist;
    let isAdded = this.props.isAdded;

    let item = this.context.song || {};
    this.setState({ isLoading: true });
    if (isAdded) {
      Request.delete(
        `playlist/${playlist.id}/song`,
        { id_song: item.id },
        null,
        { secure: true }
      )
        .then(data => {
          if (typeof this.props.onDelete === 'function') {
            this.props.onDelete(playlist);
          }
        })
        .catch(err => {
          this.getNotificationCenter().addNotification({
            message: err.message || 'Error desconocido',
            level: 'warning',
            position: 'bc',
            autoDismiss: 2
          });
        })
        .then(() => {
          this.setState({ isLoading: false });
        });
    } else {
      Request.post(
        `playlist/${playlist.id}/song`,
        { id_songs: item.id },
        null,
        { secure: true }
      )
        .then(data => {
          if (typeof this.props.onAdd === 'function') {
            this.props.onAdd(playlist);
          }
        })
        .catch(err => {
          this.getNotificationCenter().addNotification({
            message: err.message || 'Error desconocido',
            level: 'warning',
            position: 'bc',
            autoDismiss: 2
          });
        })
        .then(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
    let playlist = this.props.playlist;
    let isAdded = this.props.isAdded;

    return (
      <li
        key={playlist.id}
        className={'add-to-playlist-item ' + (isAdded ? 'active' : '')}
        onClick={this.toggle.bind(this)}
      >
        <div className="image">
          {this.state.isLoading && <Loading type="mini" />}
          {!this.state.isLoading && <Icon name="album" />}
        </div>

        <div className="name">{playlist.name}</div>

        <div className="options">
          {!this.props.isLoadingStatus && !isAdded && <Icon name="add" />}
          {!this.props.isLoadingStatus && isAdded && <Icon name="check" />}
          {this.props.isLoadingStatus && <Loading type="mini" />}
        </div>
      </li>
    );
  }
}
