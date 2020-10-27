import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { RouteGenerator } from '../../util/RouteGenerator';
import { ImageUtil, Util } from '../../util/Util';
import { Link } from '../misc/Link';

export class ArtistItem extends ItemComponent {
  render() {
    let item = this.props.item;

    return (
      <div className="artist-item">
        <Link to={RouteGenerator.artist(item)} title={item.name}>
          <div className="image">
            <img src={ImageUtil.getImageNormalUrl(item)} />
          </div>
          <div className="body">
            <div className="name notranslate">{item.name}</div>
            <div className="subtitle">{Util.getTotalSongs(item)}</div>
          </div>
        </Link>
      </div>
    );
  }
}
