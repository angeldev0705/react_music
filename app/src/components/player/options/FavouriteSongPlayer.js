import React from 'react';
import { Component } from '../../../base/Component';
import { FavouriteSong } from '../../song/options/FavouriteSong';

export class FavouriteSongPlayer extends Component {
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
    return <FavouriteSong {...this.props} />;
  }
}
