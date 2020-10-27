import React, { PureComponent } from 'react';
import PubSub from 'pubsub-js';
import ReactDOM from 'react-dom';
import { Request } from '../../util/Request';
import { TimeUtil } from '../../util/Util';
import { Slider } from '../misc/Slider';
import { SongWaveformSVG } from './waveform/SongWaveformSVG';
import { Animate } from 'react-move';

export class SongItemWaveform extends PureComponent {
  static waveItemWidth = 3;
  static waveMultiplierSize = 4;

  static contextTypes = {
    player: React.PropTypes.any.isRequired,
    isMobile: React.PropTypes.bool.isRequired
  };

  state = {
    duration: 0,
    position: 0,
    speed: 300,
    isPlaying: false,
    isLoading: false,
    isSeeking: false,
    offsetScrollX: 0,
    content: [],
    contentData: [],
    useFallback: true,
    progressWidth: 0,
    divider: 0
  };

  componentDidUpdate(prevProps, prevState) {
    let prevItem = prevProps.item || {};
    let item = this.props.item || {};
    if (prevItem.id !== item.id) {
      this.checkIsPlaying();
      this.getWaveform();
    }
    if (prevState.divider !== this.state.divider) {
      this.resumeWaveform();
    } else if (prevState.content !== this.state.content) {
      this.resumeWaveform();
    }
  }

  goToPosition() {
    let duration = this.getDuration();
    let progressWidth = this.getProgressWidth();
    let totalData = this.state.contentData.length;
    let svgWidth = totalData * SongItemWaveform.waveItemWidth;
    let block = Math.round(svgWidth / (duration / 1000));
    let speed = block * 100 * 1.25;
    progressWidth = progressWidth + block * 1;
    this.setState({ progressWidth, speed });
  }

  resumeWaveform() {
    let { divider, content } = this.state;

    if (!content) {
      return;
    }
    if (divider < 1) {
      return;
    }

    let total = content.length;
    divider = divider >= total ? total : divider;
    let tmpEachBlock = total / divider;
    let eachBlock = Math.round(tmpEachBlock);
    divider = Math.ceil(total / eachBlock);

    let contentData = [];

    __DEV__ &&
      console.log('eachBlock', eachBlock, total, divider, this.getDuration());

    contentData.push(0);
    for (let i = 0; i <= divider; i++) {
      let block = Math.round(eachBlock * i);
      let nextBlock = Math.round(eachBlock * (i + 1));
      if (typeof content[block] !== 'number') {
        continue;
      }

      let blockData = content[block];
      let nextBlockData =
        typeof content[nextBlock] === 'number'
          ? content[nextBlock]
          : content[total - 1];
      let y = Math.abs(
        nextBlockData > 0 ? (nextBlockData + blockData) / 2 : blockData
      );

      contentData.push(Math.round(y));
    }
    contentData.push(0);

    this.setState({ contentData }, () => {
      this.goToPosition();
    });
  }

  componentDidMount() {
    this.playSongListener = PubSub.subscribe(
      'onPlaySong',
      this.checkIsPlaying.bind(this)
    );
    this.audioPlayerProgressListener = PubSub.subscribe(
      'onAudioPlayerProgress',
      this.onAudioPlayerProgress.bind(this)
    );

    this.handleResizeBinded = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResizeBinded);
    this.handleResize();

    this.checkIsPlaying();
    this.getWaveform();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBinded);
    PubSub.unsubscribe(this.playSongListener);
    PubSub.unsubscribe(this.audioPlayerProgressListener);
  }

  getProgressWidth() {
    return (
      this.state.contentData.length *
      SongItemWaveform.waveItemWidth /
      (this.getDuration() / 1000) *
      (this.state.position / 1000)
    );
  }

  getTimeFromOffset(offset) {
    return (
      offset /
      (this.state.contentData.length * SongItemWaveform.waveItemWidth) *
      (this.getDuration() / 1000) *
      1000
    );
  }

  onAudioPlayerProgress(name, data) {
    this.setState({ ...data }, () => {
      if (!this.state.isSeeking) {
        this.goToPosition();
      }
    });
  }

  seekTo(time) {
    this.context.player().seekTo(time);
  }

  getWaveform() {
    this.loadWaveform();
  }

  loadWaveform() {
    let song = this.props.item || {};
    this.setState({ isLoading: true, useFallback: false, contentData: [] });
    Request.get(`song/${song.id}/waveform`, {})
      .then(data => {
        let content = data.content || [];
        if (content.length > 0) {
          this.setState({ content });
        } else {
          this.setState({ useFallback: true });
        }
      })
      .catch(err => {
        __DEV__ && console.log(err);
        this.setState({ useFallback: true });
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  checkIsPlaying(name, data) {
    if (!(this.context && typeof this.context.player === 'function')) {
      return;
    }

    try {
      let playingSong = this.context.player().getCurrentSong() || {};
      let isPlaying = false;
      if (playingSong.id) {
        let currentSong = this.props.item || {};
        isPlaying = playingSong.id === currentSong.id;
      }

      if (isPlaying !== this.state.isPlaying) {
        this.setState({ isPlaying: isPlaying });
      }
    } catch (e) {
      __DEV__ && console.log('[SONGITEMWAVEFORM]', e);
    }
  }

  getContentWidth() {
    let content = ReactDOM.findDOMNode(this.refs.content);
    return content.innerWidth || content.offsetWidth || 300;
  }

  handleResize() {
    this.onLayout();
  }

  onLayout() {
    let width = this.getContentWidth();
    let multiplier = this.context.isMobile
      ? SongItemWaveform.waveMultiplierSize / 2
      : SongItemWaveform.waveMultiplierSize;
    let divider =
      width / SongItemWaveform.waveItemWidth * Math.ceil(multiplier);
    divider = Math.ceil(divider);
    this.setState({ divider, width });
  }

  onDrag(e) {
    let touch = e.targetTouches ? e.targetTouches[0] : {};
    let positionX = e.clientX || touch.clientX;

    if (typeof positionX === 'undefined') {
      return;
    }
    let { contentData, startOffset, progressWidth } = this.state;
    let offset = startOffset - positionX + progressWidth;

    //console.log(startOffset,positionX);
    let totalData = contentData.length;
    let svgWidth = totalData * SongItemWaveform.waveItemWidth;
    if (offset >= svgWidth) {
      offset = svgWidth;
    } else if (offset < 0) {
      offset = 0;
    }

    if (offset === svgWidth) {
      return;
    }
    this.setState({ offsetScrollX: offset });
  }

  onDragStart(e) {
    let touch = e.targetTouches ? e.targetTouches[0] : {};
    let positionX = e.clientX || touch.clientX;
    this.setState({ isSeeking: true, startOffset: positionX });
    try {
      let img = document.createElement('img');
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

      e.target.style.cursor = 'move';
      e.dataTransfer.setDragImage(img, 0, 0);
    } catch (e) {}
  }

  onDragEnd(e) {
    let { isSeeking, offsetScrollX } = this.state;
    let time = this.getTimeFromOffset(offsetScrollX);

    if (isSeeking) {
      this.seekTo(time);
      this.setState({ startOffset: 0, position: time }, () => {
        this.goToPosition();

        setTimeout(() => {
          this.setState({ offsetScrollX: 0, isSeeking: false }, () => {});
        }, 200);
      });
    }
  }

  getDuration() {
    let song = this.props.item || {};
    return song.duration * 1000 || this.state.duration;
  }

  render() {
    let {
      position,
      useFallback,
      isLoading,
      speed,
      width,
      contentData,
      isSeeking,
      progressWidth,
      offsetScrollX
    } = this.state;
    let duration = this.getDuration();
    let height = this.props.height;
    let containerHeight = height;
    position = position > duration ? duration : position;

    if (useFallback || isLoading) {
      return (
        <div className="waveform fallback-container">
          <div
            className="content"
            style={{ height: containerHeight }}
            ref="content"
          >
            <Slider
              onChange={this.seekTo.bind(this)}
              max={duration}
              value={position}
            />
            <div className="time-content">
              <span className="time time-left">
                {TimeUtil.convertTime(position)}
              </span>
              <div className="spacer" />
              <span className="time time-right">
                {TimeUtil.convertTime(duration)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    let totalData = contentData.length;
    let svgWidth = totalData * SongItemWaveform.waveItemWidth;
    let offsetLeft = Math.round(width / 2);
    let progress = offsetScrollX || progressWidth;
    speed = isSeeking ? 40 : speed;

    return (
      <div className="waveform">
        <div
          className="content"
          style={{ height: containerHeight }}
          ref="content"
        >
          <div ref="scrollView" className="scroll">
            <Animate
              default={{ left: 0 }}
              data={{ left: progress }}
              duration={speed}
              flexDuration={false}
              easing="easeLinear"
            >
              {data => (
                <div
                  className="scroll-content"
                  draggable={true}
                  onDrag={this.onDrag.bind(this)}
                  onDragStart={this.onDragStart.bind(this)}
                  onDragEnd={this.onDragEnd.bind(this)}
                  onTouchMove={this.onDrag.bind(this)}
                  onTouchStartCapture={this.onDragStart.bind(this)}
                  onTouchEndCapture={this.onDragEnd.bind(this)}
                  style={{ width: svgWidth, left: offsetLeft + -1 * data.left }}
                >
                  {totalData > 0 && (
                    <div>
                      <SongWaveformSVG
                        width={svgWidth}
                        height={height}
                        contentData={contentData}
                        fillColor={'rgba(255,255,255,0.2)'}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          width: progressWidth,
                          overflow: 'hidden',
                          left: 0,
                          top: 0,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <SongWaveformSVG
                          width={svgWidth}
                          height={height}
                          contentData={contentData}
                          fillColor={'#05ffee'}
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          width: isSeeking ? offsetScrollX : 0,
                          overflow: 'hidden',
                          left: 0,
                          top: 0,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <SongWaveformSVG
                          width={svgWidth}
                          height={height}
                          contentData={contentData}
                          fillColor={'rgba(255,255,255,0.5)'}
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          overflow: 'hidden',
                          left: 0,
                          top: 0,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <SongWaveformSVG
                          width={svgWidth}
                          height={height}
                          contentData={contentData}
                          drawOnlyBottom={true}
                          fillColor={'rgba(0,0,0,0.3)'}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Animate>
          </div>

          {isSeeking &&
            offsetScrollX > 0 && (
              <div className="time-static-container" style={{ top: 1 }}>
                <div className="time-static-content">
                  <span className="time time-static">
                    {TimeUtil.convertTime(
                      this.getTimeFromOffset(offsetScrollX)
                    )}
                  </span>
                </div>
              </div>
            )}
          <div className="center">
            <div className="time-content">
              <span className="time time-left">
                {TimeUtil.convertTime(position)}
              </span>
              <div className="spacer" />
              <span className="time time-right">
                {TimeUtil.convertTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
