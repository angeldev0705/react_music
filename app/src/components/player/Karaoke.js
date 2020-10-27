import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../base/Component';
import { PlayerBackground } from '../../components/player/PlayerBackground';
import { Icon } from '../../components/misc/Icon';
import { Request } from '../../util/Request';
import { BrowserUtil, RegexUtil, TimeUtil, Util } from '../../util/Util';
import { Config } from '../../Config';
import { Loading } from '../misc/Loading';
import $ from 'jquery';

export class KaraokeMode {
  static ON = 0;
  static OFF = 1;
  static DISABLED = 3;
}

export class KaraokeStatus {
  static OFF = 1;
  static LOADING = 2;
  static PLAYING = 3;
}

export class KaraokeLine {
  text = '';
  number = 0;
  time = 0;

  constructor(text, time, number) {
    this.text = text;
    this.time = time;
    this.number = number;
  }
}

export class Karaoke extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  static info = {
    version: 1.7,
    author: Config.app.author
  };

  static patternOption = /\[([a-zA-Z0-9]+):([a-zA-Z0-9\-]+)\]/g;
  static patternText = /\[(\d{1,2}:[\d.]+)\]([^\[]+)?/g;

  listener = null;
  lastIndex = 0;

  state = {
    item: {},
    text: '',
    lines: [],
    status: KaraokeStatus.OFF,
    allowFullScreen: false,
    options: {},
    index: 0
  };

  parse(data) {
    let text = data.karaoke || '';
    this.setState({
      status: KaraokeStatus.LOADING
    });

    let parts = text.split(/\n/g);

    let options = {};
    let lines = [];
    let offset = 0;
    let lineNumber = 1;

    for (let i = 0; i < parts.length; i++) {
      let line = RegexUtil.execAll(Karaoke.patternOption, parts[i].trim());

      if (line.length > 0) {
        for (let j = 0; j < line.length; j++) {
          let option = line[line.length - (j + 1)];

          if (option[1] === 'boton') {
            options.message = option[2];
            break;
          } else if (option[1] === 'offset') {
            offset = parseFloat(option[2], 10);
            options.offset = offset;
            break;
          }
        }
      }
    }

    for (let u = 0; u < 5; u++) {
      lines.push(new KaraokeLine('', 1000 * (u + 2) * -1, u));
    }

    let time = 0;
    for (let k = 0; k < parts.length; k++) {
      let line = RegexUtil.execAll(Karaoke.patternText, parts[k].trim());
      if (line.length > 0) {
        text = '';

        for (let l = 0; l < line.length; l++) {
          let option = line[line.length - (l + 1)];
          time = TimeUtil.stringToTime(option[1]);
          if (time !== undefined) {
            if (option[2] === '' && text !== '') {
            } else if (option[2] !== undefined) {
              text = option[2];
            }

            lines.push(new KaraokeLine(text, time + offset, lineNumber));
            lineNumber++;
          }
        }
      }
    }

    let lastLine = lines[lines.length - 1] ? lines[lines.length - 1] : {};
    for (let p = 0; p < 5; p++) {
      lines.push(new KaraokeLine('', lastLine.time * (p + 2), p));
    }

    lines.sort(function(form, to) {
      return form.time > to.time ? 1 : form.time < to.time ? -1 : 0;
    });

    this.setState({
      text: text,
      lines: lines,
      status: KaraokeStatus.PLAYING,
      options: options
    });
  }

  updateIndex(time) {
    let songTime = time + 180;
    let nearIndex = 0;

    this.state.lines.forEach((line, index) => {
      if (line.time <= songTime) {
        nearIndex++;
      } else {
        return;
      }
    });

    nearIndex =
      nearIndex > 0 && nearIndex < this.state.lines.length ? nearIndex - 1 : 0;
    this.setState({
      index: nearIndex
    });
  }

  load(item) {
    let song = item || this.props.item || {};

    if (song.total_karaoke < 1) {
      this.setState({
        status: KaraokeStatus.OFF
      });
      return;
    }

    this.setState({
      status: KaraokeStatus.LOADING
    });

    Request.get(`song/${song.id}/karaoke?token=${song.token_karaoke}`)
      .then(data => {
        this.parse(data);
      })
      .catch(err => {
        this.setState({
          status: KaraokeStatus.OFF
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    let nextItem = nextProps.item || {};
    let item = this.props.item || {};
    if (nextItem.id !== item.id) {
      this.load(nextItem);
    }
  }

  componentDidUpdate() {
    let currentIndex = this.state.index || 0;
    if (currentIndex === this.lastIndex) {
      return;
    }

    let current = ReactDOM.findDOMNode(this.refs[`item${currentIndex}`]);
    if (!current) {
      console.log('nada para scrollear');
      return;
    }

    let container = $(ReactDOM.findDOMNode(this.refs.list)),
      scrollTo = $(current);

    let offset = container.height() / 2.5 - scrollTo.height() / 2.0;

    container.stop();
    container.animate(
      {
        scrollTop:
          scrollTo.offset().top -
          offset -
          container.offset().top +
          container.scrollTop()
      },
      300
    );

    this.lastIndex = currentIndex;
  }

  shouldComponentUpdate(nextProps, nextState) {
    let nextItem = nextProps.item || {};
    let item = this.props.item || {};

    let update = false;
    if (nextItem.id !== item.id) {
      update = true;
    } else if (this.state.index !== nextState.index) {
      update = true;
    } else if (this.state.status !== nextState.status) {
      update = true;
    } else if (this.state.mode !== nextState.mode) {
      update = true;
    }

    return update;
  }

  componentDidMount() {
    this.setState({
      allowFullScreen: BrowserUtil.allowFullScreen()
    });

    if (this.props.item.id) {
      this.load();
    }
  }

  render() {
    let song = this.props.item || {};

    return (
      <div className="karaoke-container">
        {this.context.isMobile && (
          <div className="page-title primary translucent">
            <Icon
              name="arrow_back"
              className="menu"
              onTouchTap={this.props.onToggleKaraoke}
            />
            <h3 />
          </div>
        )}

        {this.context.isMobile && <PlayerBackground item={song} />}

        {this.state.status === KaraokeStatus.LOADING && <Loading />}
        {this.state.status === KaraokeStatus.PLAYING && (
          <div className="lines" ref="list">
            {(lines => {
              let data = [];
              lines.forEach((line, index) => {
                if (this.state.index === index) {
                  data.push(
                    <div
                      key={index}
                      ref={'item' + index}
                      className="line active"
                    >
                      {line.text}
                    </div>
                  );
                } else if (this.state.index === index - 1) {
                  data.push(
                    <div key={index} ref={'item' + index} className="line next">
                      {line.text}
                    </div>
                  );
                } else if (this.state.index === index + 1) {
                  data.push(
                    <div
                      key={index}
                      ref={'item' + index}
                      className="line previous"
                    >
                      {line.text}
                    </div>
                  );
                } else {
                  data.push(
                    <div key={index} ref={'item' + index} className="line">
                      {line.text}
                    </div>
                  );
                }
              });

              return data;
            })(this.state.lines)}
          </div>
        )}

        {this.state.status === KaraokeStatus.OFF && (
          <div className="lines karaoke-empty">
            <div className="line previous" />
            <div className="line active">No hay karaoke para esta canción</div>
            <div className="line next">
              {Util.getArtists(song)} - {song.name}
            </div>
          </div>
        )}
      </div>
    );
  }
}
