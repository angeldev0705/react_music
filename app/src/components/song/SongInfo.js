import React from 'react';
import { Component } from '../../base/Component';
import { ImageUtil, Util } from '../../util/Util';
import { PlayerStatus } from '../player/Player';
import { Loading } from '../misc/Loading';
import { ArtistsFt } from '../song/ArtistsFt';
import { Link } from '../misc/Link';
import { RouteGenerator } from '../../util/RouteGenerator';

export class SongInfo extends Component {
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
    } else if (this.props.loadingType !== nextProps.loadingType) {
      update = true;
    } else if (this.props.isSeeking !== nextProps.isSeeking) {
      update = true;
    }

    return update;
  }

  render() {
    let song = this.props.item || {};
    let containerClass = !song || !song.id ? 'song-info disabled' : 'song-info';
    let size = this.props.size || 'large';
    let image =
      size === 'small'
        ? ImageUtil.getImageMiniUrl(song)
        : ImageUtil.getImageUrl(song);

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
          {this.props.status === PlayerStatus.LOADING ||
            (this.props.isSeeking && (
              <Loading type={this.props.loadingType || 'normal'} />
            ))}
          <img src={image} alt={Util.getArtists(song)} />
        </div>

        <div className="info">
          <div className="song notranslate">
            {this.props.linksEnabled && (
              <Link to={RouteGenerator.song(song)}>{song.name}</Link>
            )}
            {!this.props.linksEnabled && <span>{song.name}</span>}
          </div>
          <div className="artist notranslate">
            {this.props.linksEnabled && <ArtistsFt artists={song.artists} />}
            {!this.props.linksEnabled && <span>{Util.getArtists(song)}</span>}
          </div>
          {typeof this.props.children !== 'undefined' && (
            <div className="options">{this.props.children}</div>
          )}
        </div>
      </div>
    );
  }
}
