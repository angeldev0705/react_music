import React from 'react';
import { Component } from '../../../base/Component';
import { ShareSong } from '../../song/options/ShareSong';

export class ShareSongPlayer extends Component {
  static childContextTypes = {
    song: React.PropTypes.object
  };

  getChildContext() {
    return { song: this.props.item };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.item &&
      this.props.item &&
      nextProps.item.id !== this.props.item.id
    );
  }

  render() {
    return <ShareSong {...this.props} />;
  }
}
