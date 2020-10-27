import React from 'react';
import { Component } from '../../base/Component';
import { Icon } from '../misc/Icon';
import { Slider } from '../misc/Slider';

export class PlayerVolumeControl extends Component {
  state = {
    lastVolume: 0,
    isVisible: false
  };

  //    shouldComponentUpdate(nextProps, nextState) {
  //
  //        let update = false;
  //        if (nextProps.volume !== this.props.volume) {
  //            update = true;
  //        }
  //
  //        return update;
  //    }

  unMute() {
    let lastVolume = this.state.lastVolume > 10 ? this.state.lastVolume : 100;
    this.props.onVolumeTo(lastVolume);
  }

  mute() {
    this.setState({ lastVolume: this.props.volume });
    this.props.onVolumeTo(0);
  }

  toggle() {
    if (this.props.volume > 10) {
      this.mute();
    } else {
      this.unMute();
    }
  }

  showControl() {
    if (this.listener) {
      clearTimeout(this.listener);
    }
    this.setState({ isVisible: true });
  }

  hideControl() {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    this.listener = setTimeout(() => {
      this.setState({ isVisible: false });
    }, 1000);
  }

  render() {
    let volume = this.props.volume || 0;
    let volumeClassName = 'volume-container';
    volumeClassName += this.state.isVisible ? ' active ' : ' hidden ';

    return (
      <div
        onMouseEnter={this.showControl.bind(this)}
        onMouseLeave={this.hideControl.bind(this)}
      >
        <div className={volumeClassName}>
          <Slider
            value={volume}
            max={100}
            isLoading={false}
            orientation="vertical"
            onChange={this.props.onVolumeTo.bind(this)}
          />
        </div>

        <button onTouchTap={this.toggle.bind(this)}>
          {this.props.volume === 0 && <Icon name="volume_mute" />}
          {this.props.volume < 50 &&
            this.props.volume > 0 && <Icon name="volume_down" />}
          {this.props.volume >= 50 &&
            this.props.volume > 0 && <Icon name="volume_up" />}
        </button>
      </div>
    );
  }
}
