import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from '../misc/Icon';
import { PlayerStatus } from './Player';

export class PlayerPrimaryControls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    if (nextProps.status !== this.props.status) {
      update = true;
    }

    return update;
  }

  render() {
    return (
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
    );
  }
}
