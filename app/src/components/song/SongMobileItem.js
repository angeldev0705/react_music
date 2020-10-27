import React from 'react';
import { ImageUtil, Util } from '../../util/Util';
import { RouteGenerator } from '../../util/RouteGenerator';
import { SongItemOptions } from './options/SongItemOptions';
import { Icon } from '../misc/Icon';
import { SongItem } from './SongItem';
import { Link } from '../misc/Link';

export class SongMobileItem extends SongItem {
  render() {
    let item = this.props.item;
    let artists = this.props.item.artists || [];
    let index = this.props.index ? this.props.index : 0;

    return (
      <div className={'song-item ' + (this.state.isPlaying ? 'active' : '')}>
        <Link
          noRedirect={true}
          onTouchTap={this.props.onPlayAllSongs}
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
          <SongItemOptions />
        </div>
      </div>
    );
  }
}
