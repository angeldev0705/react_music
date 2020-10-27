import React from 'react';
import { Component } from '../../base/Component';
import { ImageUtil } from '../../util/Util';
import { PlayerBackground } from '../player/PlayerBackground';
import { ArtistsFt } from '../song/ArtistsFt';

export class ArtistInfo extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let nextItem = nextProps.item || {};

    let update = false;
    if (nextItem.id !== this.props.item.id) {
      update = true;
    } else if (this.props.status !== nextProps.status) {
      update = true;
    } else if (this.props.linksEnabled !== nextProps.linksEnabled) {
      update = true;
    } else if (this.props.size !== nextProps.size) {
      update = true;
    }

    return update;
  }

  render() {
    let artist = this.props.item || {};
    let containerClass =
      !artist || !artist.id ? 'artist-info disabled' : 'artist-info';
    let size = this.props.size || 'large';

    let extraProps = {};

    if (this.props.onClick) {
      extraProps.onClick = this.props.onClick;
    }
    if (this.props.onTouchTap) {
      extraProps.onTouchTap = this.props.onTouchTap;
    }

    return (
      <div {...extraProps} className={containerClass}>
        <div className="image">
          <img src={ImageUtil.getImageNormalUrl(artist)} alt={artist.name} />
        </div>

        <div className="info">
          <div className="artist notranslate">
            {this.props.linksEnabled && <ArtistsFt artists={[artist]} />}
            {!this.props.linksEnabled && <span>{artist.name}</span>}
          </div>
        </div>

        <PlayerBackground item={artist} />
      </div>
    );
  }
}
