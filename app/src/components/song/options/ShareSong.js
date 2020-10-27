import React from 'react';
import { Component } from '../../../base/Component';
import { NumberUtil, Util } from '../../../util/Util';
import { ShareSongModal } from './ShareSongModal';
import { Icon } from '../../misc/Icon';
import PubSub from 'pubsub-js';

export class ShareSong extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired
  };

  state = {
    showShareModal: false,
    total: 0
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onShareSong',
      this.checkShares.bind(this)
    );
    this.checkShares();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkShares(name, data) {
    let item = this.context.song || {};
    let response = (data && data.response) || {};
    let object = (data && data.object) || {};

    if (object.id === item.id) {
      let total =
        typeof response.total !== 'undefined'
          ? response.total
          : item.total_shares || 0;
      item.total_shares = total;
      this.setState({ total: total });
    }
  }

  reset() {
    let item = this.context.song || {};
    this.setState({ total: item.total_shares || 0 });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevContext.song.id !== this.context.song.id) {
      this.reset();
    }
  }

  render() {
    let item = this.context.song || {};
    let className = this.props.className || '';
    let showTotal = this.props.showTotal || false;
    let total = this.state.total || item.total_shares;
    return (
      <button
        className={className}
        onClick={() => {
          this.setState({ showShareModal: true });
        }}
      >
        {this.state.showShareModal && (
          <ShareSongModal
            onHide={() => {
              this.setState({ showShareModal: false });
            }}
          />
        )}
        <Icon name="share" title={'Compartir ' + Util.getSongTitle(item)} />
        {showTotal && (
          <span className="caption">{NumberUtil.format(total) || '0'}</span>
        )}
      </button>
    );
  }
}
