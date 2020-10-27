import React, { PureComponent } from 'react';
import { SongItemWaveform } from '../SongItemWaveform';

export class SongWaveformSVG extends PureComponent {
  render() {
    let props = { ...this.props };
    delete props.contentData;
    delete props.fillColor;
    delete props.drawOnlyBottom;

    let spacing = 1;
    let xG = 0;
    let inversedData = [];
    let total = this.props.contentData.length;
    let maxValue = Math.max.apply(null, this.props.contentData);
    let height = this.props.height;
    height *= 1.2;
    let offsetHeight = height / 2;
    let data = this.props.contentData.map((height, index) => {
      let y = Math.round(height / (maxValue * 2 / this.props.height));
      let x = xG;
      let xR = x + SongItemWaveform.waveItemWidth - spacing;
      let xS = xR + spacing;
      let delta = 0.4;
      xG = xS;

      inversedData[
        total - 1 - index
      ] = `${xS},${offsetHeight} ${xR},${offsetHeight} ${xR},${y * -1 +
        offsetHeight} ${x},${y * -1 + offsetHeight}`;
      return `${x},${y * delta + offsetHeight + 1} ${xR},${y * delta +
        offsetHeight +
        1} ${xR},${offsetHeight} ${xS},${offsetHeight}`;
    });
    // let data = this.props.contentData.map((height, index) => {
    //
    //     let y = Math.round(height / ((maxValue*2) / this.props.height));
    //     let x = xG;
    //     let xR = x + SongItemWaveform.waveItemWidth - spacing;
    //     let xS = xR + spacing;
    //     let delta = 0.4;
    //     xG = xS;
    //
    //     inversedData[total - 1 - index] = ` ${xR},${(y * -1) + offsetHeight} ${x},${(y * -1) + offsetHeight}`;
    //     return `${x},${(y * delta) + offsetHeight + 1} ${xR},${(y * delta) + offsetHeight + 1}`;
    // });

    let points = this.props.drawOnlyBottom
      ? data.join(' ')
      : data.join(' ') + ' ' + inversedData.join(' ');

    return (
      <svg {...props}>
        <polygon points={points} fill={this.props.fillColor} />
      </svg>
    );
  }
}
