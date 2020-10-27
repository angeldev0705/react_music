import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Util } from '../../util/Util';
import { Link } from '../misc/Link';
import { Icon } from '../misc/Icon';

export class GenreItem extends ItemComponent {
  render() {
    let item = this.props.item;

    return (
      <div className="genre-item">
        <Link to={RouteGenerator.genre(item)}>
          <Icon name="album" />
          <div className="body">
            <div className="name">{item.name}</div>
            <div className="subtitle">{Util.getTotalArtists(item)}</div>
          </div>
        </Link>
      </div>
    );
  }
}
