import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { ImageUtil, Util } from '../../util/Util';
import { RouteGenerator } from '../../util/RouteGenerator';
import { SongItemOptions } from './options/SongItemOptions';
import { Icon } from '../misc/Icon';
import { Link } from '../misc/Link';

export class SongQueueItem extends ItemComponent {
  static childContextTypes = {
    song: React.PropTypes.object
  };

  getChildContext() {
    return { song: this.props.item };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let nextItem = nextProps.item || {};
    let update = false;

    if (this.props.item && nextItem.id !== this.props.item.id) {
      update = true;
    } else if (nextProps.index !== this.props.index) {
      update = true;
    } else if (nextProps.active !== this.props.active) {
      update = true;
    }

    return update;
  }

  render() {
    let item = this.props.item;
    let index = this.props.index || 0;

    //         return (
    //             <div data-index={index} className={this.props.active ? 'song-item-queue active' : 'song-item-queue'}>
    //                 <span onTouchTap={this.props.onRemoveSong.bind(this,index)} className="remove"><Icon
    //                     name="delete"/></span>
    //                 <span className="index"><Icon name="remove"/></span>
    //                 <span onTouchTap={this.props.onTouchTap.bind(this,index)} className="notranslate song">
    //                     {Util.getSongTitleInverted(item)}
    //                 </span>
    //                 <span className="time notranslate">{TimeUtil.convertTime(item.duration * 1000)}</span>
    //                 <span className="options">
    //                     <SongItemOptions type="queue"/>
    //                 </span>
    //             </div>
    //         );
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
