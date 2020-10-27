import React from 'react';
import { Component } from '../../../base/Component';
import { ListenSong } from '../../song/options/ListenSong';

export class ListenSongPlayer extends Component {
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
    return <ListenSong {...this.props} />;
  }
}
