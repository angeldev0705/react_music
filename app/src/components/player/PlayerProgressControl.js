import React from 'react';
import { Component } from '../../base/Component';
import { Slider } from '../misc/Slider';
import { PlayerStatus } from './Player';

export class PlayerProgressControl extends Component {
  state = {
    durationEstimate: 0,
    position: 0,
    duration: 0
  };

  seekTo(time) {
    this.props.onSeekTo(time);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    if (nextState.durationEstimate !== this.state.durationEstimate) {
      update = true;
    } else if (nextState.position !== this.state.position) {
      update = true;
    } else if (nextState.duration !== this.state.duration) {
      update = true;
    } else if (nextProps.status !== this.props.status) {
      update = true;
    } else if (nextProps.isSeeking !== this.props.isSeeking) {
      update = true;
    }

    return update;
  }

  render() {
    let duration =
      this.state.duration === 0
        ? this.state.durationEstimate
        : this.state.duration;

    return (
      <div className="progress-container" onClick={this.seekTo}>
        <Slider
          value={this.state.position || 0}
          max={this.state.duration || 0}
          secondaryValue={duration}
          isLoading={
            this.props.status === PlayerStatus.LOADING || this.props.isSeeking
          }
          orientation="horizontal"
          onChange={this.props.onSeekTo.bind(this)}
        />
      </div>
    );
  }
}
