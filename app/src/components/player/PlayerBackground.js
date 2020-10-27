import React from 'react';
import { Component } from '../../base/Component';
import { ImageUtil } from '../../util/Util';

export class PlayerBackground extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let nextItem = nextProps.item || {};

    let update = false;
    if (nextItem.id !== this.props.item.id) {
      update = true;
    }

    return update;
  }

  render() {
    let song = this.props.item || {};

    let backgroundStyles = {
      backgroundImage: 'url("' + ImageUtil.getImageUrl(song) + '")'
    };

    return <div className="player-background" style={backgroundStyles} />;
  }
}
