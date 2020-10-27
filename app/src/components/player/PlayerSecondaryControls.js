import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from '../misc/Icon';
import { QueueStatus, RandomMode, RepeatMode } from './Player';
import { KaraokeMode } from './Karaoke';

export class PlayerSecondaryControls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    if (nextProps.repeatMode !== this.props.repeatMode) {
      update = true;
    } else if (nextProps.randomMode !== this.props.randomMode) {
      update = true;
    } else if (nextProps.karaokeMode !== this.props.karaokeMode) {
      update = true;
    } else if (nextProps.queueStatus !== this.props.queueStatus) {
      update = true;
    } else if (nextProps.volumeControl !== this.props.volumeControl) {
      update = true;
    } else if (nextProps.hasKaraoke !== this.props.hasKaraoke) {
      update = true;
    }

    return update;
  }

  render() {
    return (
      <ul className="options">
        <li
          className={
            this.props.queueStatus === QueueStatus.ON ? 'queue active' : 'queue'
          }
        >
          <button onTouchTap={this.props.onToggleQueue}>
            <Icon name="queue_music" />
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
            this.props.randomMode === RandomMode.ON ? 'random active' : 'random'
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
      </ul>
    );
  }
}
