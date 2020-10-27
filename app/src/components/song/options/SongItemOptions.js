import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../../base/Component';
import { ShareSongModal } from './ShareSongModal';
import { Icon } from '../../misc/Icon';
import { SongItemOptionsPopover } from './SongItemOptionsPopover';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import { SongItemArtistsPopover } from './SongItemArtistsPopover';
import { DownloadSongModal } from './DownloadSongModal';
import { LoginModal } from '../../account/LoginModal';
import { PreLoginModal } from '../../account/PreLoginModal';
import { Auth } from '../../../middleware/Auth';

export class SongItemOptions extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    userProfile: React.PropTypes.object.isRequired
  };

  static lastOptions = null;
  static seed = 0;
  id = '';
  state = {
    showOptions: false,
    showGoToArtists: false,
    showDownloadModal: false,
    showAddToPlaylistModal: false,
    showLoginModal: false,
    showPreLoginModal: false,
    showShareModal: false
  };

  componentWillMount() {
    this.id = `options_${SongItemOptions.seed}`;
    SongItemOptions.seed++;
  }

  toggle() {
    if (!this.state.showOptions && this.state.showGoToArtists) {
      this.setState({ showGoToArtists: false });
    } else {
      let isShowing = !this.state.showOptions;

      this.setState({ showOptions: isShowing });

      if (isShowing) {
        if (
          SongItemOptions.lastOptions &&
          SongItemOptions.lastOptions.mounted &&
          this.id !== SongItemOptions.lastOptions.id
        ) {
          SongItemOptions.lastOptions.setState({
            showGoToArtists: false,
            showOptions: false
          });
        }

        SongItemOptions.lastOptions = this;
      }
    }
  }

  showDownload() {
    //FIXME corregir
    //        let profile = this.context.userProfile || {};
    let profile = Auth.getProfile() || {};

    if (!profile.id) {
      this.showPreLogin(this.showDownload.bind(this));
    } else {
      this.setState({ showDownloadModal: true });
      this.hide();
    }
  }

  showPreLogin(cb) {
    this.setState({ showPreLoginModal: true });
    this.hide();
    this.lastLoginCallback = cb;
  }

  showLogin(cb) {
    this.setState({ showLoginModal: true });
    this.hide();
    this.lastLoginCallback = cb;
  }

  showAddToPlaylist() {
    //FIXME corregir
    //        let profile = this.context.userProfile || {};
    let profile = Auth.getProfile() || {};

    if (!profile.id) {
      this.showLogin(this.showAddToPlaylist.bind(this));
    } else {
      this.setState({ showAddToPlaylistModal: true });
      this.hide();
    }
  }

  showShare() {
    this.setState({ showShareModal: true });
    this.hide();
  }

  showGoToArtists() {
    this.setState({ showGoToArtists: true, showOptions: false });
  }

  show() {
    this.setState({ showOptions: true, showGoToArtists: false });
  }

  hide() {
    this.setState({ showOptions: false });
  }

  hideGoToArtists() {
    this.setState({ showGoToArtists: false });
  }

  render() {
    return (
      <div className="more-option">
        <button
          ref="target"
          onTouchTap={this.toggle.bind(this)}
          className="more"
        >
          <Icon name="more_vert" />
        </button>

        {this.state.showOptions && (
          <SongItemOptionsPopover
            target={() => ReactDOM.findDOMNode(this.refs.target)}
            onHide={this.hide.bind(this)}
            type={this.props.type}
            onShowGoToArtists={this.showGoToArtists.bind(this)}
            onShowAddToPlaylistModal={this.showAddToPlaylist.bind(this)}
            onShowDownloadModal={this.showDownload.bind(this)}
            onShowShareModal={this.showShare.bind(this)}
          />
        )}

        {this.state.showGoToArtists && (
          <SongItemArtistsPopover
            target={() => ReactDOM.findDOMNode(this.refs.target)}
            onShowOptions={this.show.bind(this)}
            onHide={this.hideGoToArtists.bind(this)}
          />
        )}

        {this.state.showDownloadModal && (
          <DownloadSongModal
            onHide={() => {
              this.setState({ showDownloadModal: false });
            }}
          />
        )}
        {this.state.showShareModal && (
          <ShareSongModal
            onHide={() => {
              this.setState({ showShareModal: false });
            }}
          />
        )}
        {this.state.showAddToPlaylistModal && (
          <AddToPlaylistModal
            onHide={() => {
              this.setState({ showAddToPlaylistModal: false });
            }}
          />
        )}
        {this.state.showLoginModal && (
          <LoginModal
            onSuccess={this.lastLoginCallback}
            onHide={() => {
              this.setState({ showLoginModal: false });
            }}
          />
        )}
        {this.state.showPreLoginModal && (
          <PreLoginModal
            onSuccess={this.lastLoginCallback}
            onHide={() => {
              this.setState({ showPreLoginModal: false });
            }}
          />
        )}
      </div>
    );
  }
}
