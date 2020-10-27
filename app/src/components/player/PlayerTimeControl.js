import React from 'react';
import { Component } from '../../base/Component';
import { TimeUtil } from '../../util/Util';

export class PlayerTimeControl extends Component {
  state = {
    durationEstimate: 0,
    position: 0,
    duration: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    if (nextState.durationEstimate !== this.state.durationEstimate) {
      update = true;
    } else if (nextState.position !== this.state.position) {
      update = true;
    } else if (nextState.duration !== this.state.duration) {
      update = true;
    }

    return update;
  }

  render() {
    return (
      <div className="time notranslate">
        <span className="current">
          {TimeUtil.convertTime(this.state.position)}
        </span>
        <span className="split"> / </span>
        <span className="duration">
          {TimeUtil.convertTime(this.state.durationEstimate)}
        </span>
      </div>
    );
  }
}
