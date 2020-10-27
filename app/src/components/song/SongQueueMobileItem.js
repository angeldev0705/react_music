import React from 'react';
import { ImageUtil, Util } from '../../util/Util';
import { RouteGenerator } from '../../util/RouteGenerator';
import { SongItemOptions } from './options/SongItemOptions';
import { Icon } from '../misc/Icon';
import { Link } from '../misc/Link';
import { SongQueueItem } from './SongQueueItem';

export class SongQueueMobileItem extends SongQueueItem {
  render() {
    let item = this.props.item;
    let index = this.props.index || 0;

    return (
      <div
        data-index={index}
        className={this.props.active ? 'song-item active' : 'song-item'}
      >
        <Link
          noRedirect={true}
          onTouchTap={this.props.onTouchTap.bind(this, index)}
          to={RouteGenerator.song(item)}
        >
          <div className="image">
            <img
              src={ImageUtil.getImageMiniUrl(item)}
              alt={Util.getArtists(item)}
            />
          </div>

          <div className="info">
            <div className="song notranslate">{item.name}</div>
            <div className="notranslate artist">{Util.getArtists(item)}</div>
          </div>
          {item.total_karaoke > 0 && (
            <Icon name="format_align_center" className="karaoke" />
          )}
        </Link>

        <div className="options">
          <div
            title="Eliminar canción de la cola de reproducción"
            onTouchTap={this.props.onRemoveSong.bind(this, index)}
            className="remove-option"
          >
            <Icon name="delete" />
          </div>
          <SongItemOptions type="queue" />
        </div>
      </div>
    );
  }
}
