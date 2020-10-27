import React from 'react';
import { Component } from '../../../base/Component';
import { NumberUtil, Util } from '../../../util/Util';
import { PreLoginModal } from '../../account/PreLoginModal';
import { DownloadSongModal } from './DownloadSongModal';
import { Icon } from '../../misc/Icon';
import PubSub from 'pubsub-js';
import { Auth } from '../../../middleware/Auth';

export class DownloadSong extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    userProfile: React.PropTypes.object.isRequired
  };

  state = {
    showLoginModal: false,
    showDownloadModal: false,
    total: 0
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onDownloadSong',
      this.checkDownloads.bind(this)
    );
    this.checkDownloads();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkDownloads(name, data) {
    let item = this.context.song || {};
    let response = (data && data.response) || {};
    let object = (data && data.object) || {};

    if (object.id === item.id) {
      let total =
        typeof response.total !== 'undefined'
          ? response.total
          : item.total_downloads || 0;
      item.total_downloads = total;
      this.setState({ total: total });
    }
  }

  reset() {
    let item = this.context.song || {};
    this.setState({ total: item.total_downloads || 0 });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevContext.song.id !== this.context.song.id) {
      this.reset();
    }
  }

  showModal() {
    //FIXME corregir
    //        let profile = this.context.userProfile || {};
    let profile = Auth.getProfile() || {};

    if (!profile.id) {
      this.setState({ showLoginModal: true });
      return;
    }

    this.setState({ showDownloadModal: true });
  }

  hideLoginModal() {
    this.setState({ showLoginModal: false });
  }

  render() {
    let item = this.context.song || {};
    let className = this.props.className || '';
    let showTotal = this.props.showTotal || false;
    let total = this.state.total || item.total_downloads;
    return (
      <button className={className} onClick={this.showModal.bind(this)}>
        {this.state.showDownloadModal && (
          <DownloadSongModal
            onHide={() => {
              this.setState({ showDownloadModal: false });
            }}
          />
        )}
        {this.state.showLoginModal && (
          <PreLoginModal
            onSuccess={this.showModal.bind(this)}
            onHide={this.hideLoginModal.bind(this)}
          />
        )}
        <Icon
          name="cloud_download"
          title={'Descargar ' + Util.getSongTitle(item)}
        />
        {showTotal && (
          <span className="caption">{NumberUtil.format(total) || '0'}</span>
        )}
      </button>
    );
  }
}
