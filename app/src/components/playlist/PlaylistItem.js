import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Util } from '../../util/Util';
import { Link } from '../misc/Link';
import { Icon } from '../misc/Icon';

export class PlaylistItem extends ItemComponent {
  render() {
    let item = this.props.item;

    return (
      <div className="playlist-item">
        <Link to={RouteGenerator.playlist(item)}>
          <Icon name="album" />
          <div className="body">
            <div className="name">{item.name}</div>
            <div className="subtitle">{Util.getTotalSongs(item)}</div>
          </div>
        </Link>
      </div>
    );
  }
}
