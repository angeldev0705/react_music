import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from '../misc/Icon';
import { PlayerStatus, QueueStatus, RandomMode, RepeatMode } from './Player';
import { KaraokeMode } from './Karaoke';

export class PlayerControls extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    if (nextProps.status !== this.props.status) {
      update = true;
    } else if (nextProps.repeatMode !== this.props.repeatMode) {
      update = true;
    } else if (nextProps.randomMode !== this.props.randomMode) {
      update = true;
    } else if (nextProps.karaokeMode !== this.props.karaokeMode) {
      update = true;
    } else if (nextProps.queueStatus !== this.props.queueStatus) {
      update = true;
    } else if (nextProps.volumeControl !== this.props.volumeControl) {
      update = true;
    } else if (nextProps.songOptionsControl !== this.props.songOptionsControl) {
      update = true;
    } else if (nextProps.hasKaraoke !== this.props.hasKaraoke) {
      update = true;
    } else if (nextProps.timeControl !== this.props.timeControl) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    }

    return update;
  }

  render() {
    return (
      <div className="controls-container">
        {this.context.isMobile && (
          <ul className="primary">
            <li className="prev">
              <button onTouchTap={this.props.onPrev}>
                <Icon name="skip_previous" />
              </button>
            </li>
            {this.props.status !== PlayerStatus.PLAYING && (
              <li className="play">
                <button onTouchTap={this.props.onPlay}>
                  <Icon name="play_arrow" />
                </button>
              </li>
            )}
            {this.props.status === PlayerStatus.PLAYING && (
              <li className="pause">
                <button onTouchTap={this.props.onPause}>
                  <Icon name="pause" />
                </button>
              </li>
            )}
            <li className="next">
              <button onTouchTap={this.props.onNext}>
                <Icon name="skip_next" />
              </button>
            </li>
          </ul>
        )}
        {!this.context.isMobile && (
          <ul className="primary">
            {this.props.songOptionsControl && (
              <li>{this.props.songOptionsControl}</li>
            )}

            <li
              className={
                this.props.randomMode === RandomMode.ON
                  ? 'random active'
                  : 'random'
              }
            >
              <button onTouchTap={this.props.onToggleRandomMode}>
                <Icon name="shuffle" />
              </button>
            </li>
            {this.props.repeatMode === RepeatMode.ON && (
              <li className="repeat active">
                <button onTouchTap={this.props.onToggleRepeatMode}>
                  <Icon name="repeat" />
                </button>
              </li>
            )}
            {this.props.repeatMode === RepeatMode.OFF && (
              <li className="repeat">
                <button onTouchTap={this.props.onToggleRepeatMode}>
                  <Icon name="repeat" />
                </button>
              </li>
            )}
            {this.props.repeatMode === RepeatMode.ONE && (
              <li className="repeat active one">
                <button onTouchTap={this.props.onToggleRepeatMode}>
                  <Icon name="repeat_one" />
                </button>
              </li>
            )}

            <li className="prev">
              <button onTouchTap={this.props.onPrev}>
                <Icon name="skip_previous" />
              </button>
            </li>
            {this.props.status !== PlayerStatus.PLAYING && (
              <li className="play">
                <button onTouchTap={this.props.onPlay}>
                  <Icon name="play_arrow" />
                </button>
              </li>
            )}
            {this.props.status === PlayerStatus.PLAYING && (
              <li className="pause">
                <button onTouchTap={this.props.onPause}>
                  <Icon name="pause" />
                </button>
              </li>
            )}
            <li className="next">
              <button onTouchTap={this.props.onNext}>
                <Icon name="skip_next" />
              </button>
            </li>
            {this.props.hasKaraoke && (
              <li
                className={
                  this.props.karaokeMode === KaraokeMode.ON
                    ? 'karaoke active'
                    : 'karaoke'
                }
              >
                <button onTouchTap={this.props.onToggleKaraokeMode}>
                  <Icon name="format_align_center" />
                </button>
              </li>
            )}
            {!this.props.hasKaraoke && (
              <li
                className={
                  this.props.karaokeMode === KaraokeMode.ON
                    ? 'karaoke active disabled'
                    : 'karaoke disabled'
                }
              >
                <button onTouchTap={this.props.onToggleKaraokeMode}>
                  <Icon name="format_align_center" />
                </button>
              </li>
            )}
            <li
              className={
                this.props.queueStatus === QueueStatus.ON
                  ? 'queue active'
                  : 'queue'
              }
            >
              <button onTouchTap={this.props.onToggleQueue}>
                <Icon name="queue_music" />
              </button>
            </li>
            {this.props.volumeControl && (
              <li className="volume">{this.props.volumeControl}</li>
            )}
            {this.props.timeControl && (
              <li className="time">{this.props.timeControl}</li>
            )}
          </ul>
        )}
      </div>
    );
  }
}
