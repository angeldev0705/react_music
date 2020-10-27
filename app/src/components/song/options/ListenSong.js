import React from 'react';
import { Component } from '../../../base/Component';
import { NumberUtil } from '../../../util/Util';
import { Icon } from '../../misc/Icon';
import PubSub from 'pubsub-js';

export class ListenSong extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired
  };

  state = {
    total: 0
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onListenSong',
      this.checkListens.bind(this)
    );
    this.checkListens();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkListens(name, data) {
    let item = this.context.song || {};
    let response = (data && data.response) || {};
    let object = (data && data.object) || {};

    if (object.id === item.id) {
      let total =
        typeof response.total !== 'undefined'
          ? response.total
          : item.total_listens || 0;
      item.total_listens = total;
      this.setState({ total: total });
    }
  }

  reset() {
    let item = this.context.song || {};
    this.setState({ total: item.total_listens || 0 });
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
    let total = this.state.total || item.total_listens;
    return (
      <button className={className}>
        <Icon name="play_arrow" />
        {showTotal && (
          <span className="caption">{NumberUtil.format(total) || '0'}</span>
        )}
      </button>
    );
  }
}
