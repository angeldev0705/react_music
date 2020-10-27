import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { RouteGenerator } from '../../util/RouteGenerator';
import { ImageUtil, Util } from '../../util/Util';
import { Link } from '../misc/Link';

export class CategoryPlaylistItem extends ItemComponent {
  render() {
    let { item, style } = this.props;

    return (
      <div className="category-item" style={{ height: style.width }}>
        <div className="margin">
          <Link to={RouteGenerator.categoryPlaylist(item)}>
            <img
              className="image"
              src={ImageUtil.getImageUrl(item)}
              style={{ height: style.width - 15 }}
              alt={item.name}
            />
            <div className="header" />
            <div className="body">
              <div className="name">{item.name}</div>
              <div className="subtitle">{Util.getTotalSongs(item)}</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
