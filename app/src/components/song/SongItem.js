import React from 'react';
import { ItemComponent } from '../base/ItemComponent';
import { TimeUtil } from '../../util/Util';
import { ArtistsFt } from './ArtistsFt';
import { PlayerStatus } from '../player/Player';
import { RouteGenerator } from '../../util/RouteGenerator';
import { DownloadSong } from './options/DownloadSong';
import { FavouriteSong } from './options/FavouriteSong';
import { SongItemOptions } from './options/SongItemOptions';
import { Icon } from '../misc/Icon';
import { Link } from '../misc/Link';
import PubSub from 'pubsub-js';

export class SongItem extends ItemComponent {
  static contextTypes = {
    player: React.PropTypes.any.isRequired
  };

  static childContextTypes = {
    song: React.PropTypes.object
  };

  state = {
    isPlaying: false
  };

  getChildContext() {
    return {
      song: this.props.item
    };
  }

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onPlaySong',
      this.checkIsPlaying.bind(this)
    );
    this.checkIsPlaying();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkIsPlaying() {
    let playingSong = this.getPlayer().getCurrentSong() || {};
    let isPlaying = false;
    if (playingSong.id) {
      let song = this.props.item || {};
      isPlaying =
        playingSong.id === song.id &&
        this.getPlayer().state.status === PlayerStatus.PLAYING;
    }

    if (isPlaying !== this.state.isPlaying) {
      this.setState({ isPlaying: isPlaying });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let nextItem = nextProps.item || {};
    let item = this.props.item || {};
    let update = false;

    if (nextItem.id !== item.id) {
      update = true;
    } else if (nextState.isPlaying !== this.state.isPlaying) {
      update = true;
    } else if (nextProps.editMode !== this.props.editMode) {
      update = true;
    }

    return update;
  }

  render() {
    let item = this.props.item;
    let artists = this.props.item.artists || [];
    let index = this.props.index ? this.props.index : 0;

    return (
      <tr className={this.state.isPlaying ? 'active' : ''}>
        {this.props.editMode && (
          <td
            className="delete"
            title="Eliminar canción"
            onTouchTap={this.props.onDelete}
          >
            <button className="btn btn-danger btn-xs">
              <Icon name="delete" />
            </button>
          </td>
        )}
        {!this.props.editMode &&
          !this.state.isPlaying && (
            <td className="addAll" onTouchTap={this.props.onPlayAllSongs}>
              {item.total_karaoke > 0 && (
                <Icon name="format_align_center" className="karaoke" />
              )}
              <Icon name="play_circle_outline" className="play" />
            </td>
          )}

        {!this.props.editMode &&
          this.state.isPlaying && (
            <td
              className="pause"
              onTouchTap={() => {
                this.getPlayer().pause();
              }}
            >
              <Icon name="pause" className="pause" />
            </td>
          )}

        <td
          className="add hidden-xs"
          onTouchTap={() => {
            this.getPlayer().addToNext(item);
          }}
        >
          <Icon name="add" />
        </td>

        <td className="favourite hidden-xs">
          <FavouriteSong />
        </td>

        <td
          className="song notranslate"
          onTouchTap={() => {
            this.getPlayer().addAndPlay([item], 0, false);
          }}
        >
          <Link noRedirect={true} to={RouteGenerator.song(item)}>
            {item.name}
          </Link>
        </td>
        <td className="notranslate artist">
          <ArtistsFt artists={artists} />
        </td>

        <td className="notranslate duration hidden-xs">
          {TimeUtil.convertTime(item.duration * 1000)}
        </td>
        {this.props.isTop && (
          <td className="listens hidden-xs hidden-sm">{item.total_listens}</td>
        )}

        <td className="download hidden-xs hidden-sm">
          <DownloadSong />
        </td>

        <td className="options">
          <SongItemOptions />
        </td>
      </tr>
    );
  }
}
