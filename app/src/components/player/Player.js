import React from 'react';
import { Component } from '../../base/Component';
import { Storage } from '../../util/Storage';
import { Analytics } from '../../util/Analytics';
import { SongInfo } from '../song/SongInfo';
import { Karaoke, KaraokeMode } from './Karaoke';
import { PlayerQueue } from './PlayerQueue';
import { PlayerPrimaryControls } from './PlayerPrimaryControls';
import { PlayerSecondaryControls } from './PlayerSecondaryControls';
import { PlayerProgressControl } from './PlayerProgressControl';
import { PlayerVolumeControl } from './PlayerVolumeControl';
import { SongPlayerItemOptions } from './options/SongPlayerItemOptions';
import { DownloadSongPlayer } from './options/DownloadSongPlayer';
import { SongItemWaveform } from '../song/SongItemWaveform';
import { Icon } from '../misc/Icon';
import { Config } from '../../Config';
import PubSub from 'pubsub-js';
import { ObjectUtil } from '../../util/Util';
import { Request } from '../../util/Request';
import Geolocation from '../../middleware/Geolocation';
import { PlayerBackground } from './PlayerBackground';
import { FavouriteSongPlayer } from './options/FavouriteSongPlayer';
import { ShareSongPlayer } from './options/ShareSongPlayer';
import { ListenSongPlayer } from './options/ListenSongPlayer';

export class SongToPosition {
  static DEFAULT = 0;
  static NEXT = 1;
  static CURRENT = 2;
  static END = 3;
}

export class PlayerStatus {
  static LOADING = 0;
  static PLAYING = 1;
  static PAUSED = 2;
  static STOPPED = 4;
  static ERROR = 5;
}

export class RandomMode {
  static ON = 0;
  static OFF = 1;
}

export class QueueStatus {
  static ON = 0;
  static OFF = 1;
}

export class RepeatMode {
  static ON = 0;
  static OFF = 1;
  static ONE = 2;
}

export class Player extends Component {
  static contextTypes = {
    notificationCenter: React.PropTypes.any.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    isPlayerActive: React.PropTypes.bool.isRequired
  };
  static urls = {};
  state = {
    status: PlayerStatus.STOPPED,
    randomMode: RandomMode.ON,
    repeatMode: RepeatMode.OFF,
    karaokeMode: KaraokeMode.OFF,
    queueStatus: QueueStatus.ON,
    isSeeking: false,
    miniPlayerEnabled: false,
    favourites: [],
    queue: [],
    currentIndex: 0,
    volume: 100
  };
  add = (songs, replace, cb) => {
    if (!songs) {
      console.error('nada para agregar');
      return;
    }

    let queue = this.state.queue;
    if (replace) {
      queue = [];
    }
    if (Array.isArray(songs)) {
      queue = queue.concat(songs);
    } else {
      queue.push(songs);
    }

    this.setState(
      {
        queue: queue
      },
      cb
    );
  };

  addAndPlay = (songs, index, replace) => {
    let newIndex = index;
    if (!replace) {
      newIndex = this.state.queue.length + index;
    }

    this.add(songs, replace, () => {
      this.playWithIndex(newIndex);
    });
  };

  addAndReplaceCurrent = (song, autoplay) => {
    let queue = [];
    let currentSong = this.getCurrentSong();
    if (currentSong && currentSong.id) {
      queue = this.state.queue.map((data, index) => {
        if (index === this.state.currentIndex) {
          return song;
        } else {
          return data;
        }
      });
    } else {
      queue = [...this.state.queue, song];
    }

    this.setState({ queue: queue }, () => {
      if (autoplay) {
        this.play();
      }
    });
  };

  addToNext = song => {
    let currentSong = this.state.queue[this.state.currentIndex + 1];
    if (currentSong && currentSong.id) {
      //TODO esto puede fallar
      let queue = [
        ...this.state.queue.slice(0, this.state.currentIndex + 1),
        song,
        ...this.state.queue.slice(this.state.currentIndex + 1)
      ];

      this.setState({ queue: queue });
    } else {
      this.addToEnd(song);
    }
  };
  addToEnd = song => {
    this.add(song);
  };
  removeWithIndex = index => {
    //FIXME es medio raro
    let newIndex = this.state.currentIndex;
    let nextAgain = false;

    if (index < newIndex) {
      newIndex--;
    } else if (index === newIndex) {
      newIndex--;
      //FIXME cuando esta en random esto genera un error
      nextAgain = true;
    } else if (index === this.state.queue.length - 1) {
      nextAgain = true;
    }

    if (!(index > -1 && index < this.state.queue.length)) {
      console.log('indice invalido: ' + index);
      return;
    }

    let queue = this.state.queue.filter((data, itemIndex) => {
      return index !== itemIndex;
    });

    newIndex = newIndex < 0 ? 0 : newIndex;

    this.setState({ queue: queue, currentIndex: newIndex }, () => {
      if (queue.length < 1) {
        this.stop();
      } else if (nextAgain) {
        this.next();
      }
    });
  };
  playWithIndex = index => {
    this.setState({ currentIndex: index }, () => {
      this.play();
    });
  };
  resume = () => {
    if (this.audio) {
      this.audio.play();
    }
    this.setState({ status: PlayerStatus.PLAYING });
  };
  pause = () => {
    if (this.audio) {
      this.audio.pause();
    }
    this.setState({ status: PlayerStatus.PAUSED });
  };
  stop = () => {
    if (this.audio) {
      this.audio.stop();
    }
    this.setState({ status: PlayerStatus.STOPPED });
  };
  next = () => {
    if (this.state.queue.length < 1) {
      console.error('nada para cambiar');
      return;
    }

    let index = 0;
    if (this.state.randomMode === RandomMode.ON) {
      for (let i = 0; i < 10; i++) {
        index = Math.floor(Math.random() * this.state.queue.length);
        if (index !== this.state.currentIndex) {
          break;
        }
      }
    } else {
      index = this.state.currentIndex;
      index++;

      if (index >= this.state.queue.length) {
        index = 0;
      }
    }

    this.playWithIndex(index);
  };
  prev = () => {
    if (this.state.queue.length < 1) {
      console.error('nada para cambiar');
      return;
    }

    let index = this.state.currentIndex;
    index--;

    if (index < 0) {
      index = this.state.queue.length - 1;
    }

    this.playWithIndex(index);
  };
  seekTo = time => {
    let prevStatus = this.state.status;
    if (
      !(
        prevStatus === PlayerStatus.PLAYING ||
        prevStatus === PlayerStatus.PAUSED
      )
    ) {
      console.log('debe reproducir para cambiar tiempo');
      return;
    }

    if (this.audio) {
      this.setState({ isSeeking: true }, () => {
        this.audio.setPosition(time);
      });
    }
  };
  volumeTo = volume => {
    this.setState({ volume: volume });

    if (this.audio) {
      this.audio.setVolume(volume);
    }
  };
  toggleRepeatMode = () => {
    let repeatMode;
    let randomMode = this.state.randomMode;
    switch (this.state.repeatMode) {
      case RepeatMode.OFF:
        repeatMode = RepeatMode.ON;
        break;
      case RepeatMode.ON:
        repeatMode = RepeatMode.ONE;
        if (randomMode === RandomMode.ON) {
          randomMode = RandomMode.OFF;
        }
        break;
      case RepeatMode.ONE:
        repeatMode = RepeatMode.OFF;
        break;
    }

    this.setState({ repeatMode: repeatMode, randomMode: randomMode });
  };
  toggleRandomMode = () => {
    let randomMode;
    let repeatMode = this.state.repeatMode;
    switch (this.state.randomMode) {
      case RandomMode.OFF:
        randomMode = RandomMode.ON;
        if (repeatMode === RepeatMode.ONE) {
          repeatMode = RepeatMode.ON;
        }
        break;
      case RandomMode.ON:
        randomMode = RandomMode.OFF;
        break;
    }

    this.setState({ randomMode: randomMode, repeatMode: repeatMode });
  };
  toggleQueue = () => {
    let queueStatus;
    let karaokeMode = this.state.karaokeMode;
    switch (this.state.queueStatus) {
      case QueueStatus.OFF:
        if (karaokeMode === KaraokeMode.ON) {
          karaokeMode = KaraokeMode.OFF;
        }
        queueStatus = QueueStatus.ON;
        break;
      case QueueStatus.ON:
        queueStatus = QueueStatus.OFF;
        break;
    }

    this.setState({ queueStatus: queueStatus, karaokeMode: karaokeMode });
  };
  toggleKaraokeMode = () => {
    let karaokeMode;
    let queueStatus = this.state.queueStatus;
    switch (this.state.karaokeMode) {
      case KaraokeMode.OFF:
        /*if (queueStatus === QueueStatus.ON) {
                            queueStatus = QueueStatus.OFF;
                        }*/
        karaokeMode = KaraokeMode.ON;
        break;
      case KaraokeMode.ON:
        karaokeMode = KaraokeMode.OFF;
        break;
      case KaraokeMode.DISABLED:
        karaokeMode = KaraokeMode.DISABLED;
        break;
    }

    this.setState({ karaokeMode: karaokeMode, queueStatus: queueStatus });
  };
  resumeOrPlay = () => {
    if (this.state.status === PlayerStatus.PAUSED && this.audio) {
      this.resume();
    } else {
      this.play();
    }
  };
  play = () => {
    let song = this.getCurrentSong();
    if (!song) {
      this.showMessage('Primero, selecciona una canción');
      return;
    }

    Analytics.event('play-song', song);

    this.setState({
      status: PlayerStatus.LOADING
    });

    this.stopAudio();
    this.setProgress({
      durationEstimate: 0,
      position: 0,
      duration: 0
    });

    song.total_listens += 1;

    PubSub.publish('onPlaySong', song);

    let { longitude, latitude } = Geolocation.getPosition();
    let params = ObjectUtil.toQueryString(
      Request.getParams(
        {
          mode: 'fast',
          long: longitude,
          lat: latitude
        },
        { secure: true }
      )
    );
    let url = `${Config.server.url}/song/${song.id}/stream/${
      song.token_stream
    }.${song.format}${params ? '?' + params : ''}`;
    this.playWithUrl(url, song);
  };
  playWithUrl = (url, song) => {
    this.setState({
      status: PlayerStatus.LOADING
    });

    this.stopAudio();
    this.audio = soundManager.createSound({
      id: `song_${song.id}`,
      url: url,
      autoLoad: false,
      volume: this.state.volume,
      onload: () => {
        if (this.state.status !== PlayerStatus.PLAYING) {
          this.setState({
            status: PlayerStatus.PLAYING
          });
        }

        this.setProgress({
          duration: this.audio.duration
        });
      },
      onbufferchange: () => {
        //console.log('onbufferchange')
      },
      whileloading: () => {
        this.setProgress({
          durationEstimate: this.audio.durationEstimate
        });
      },
      whileplaying: () => {
        if (!this.state.isSeeking) {
          if (this.state.status !== PlayerStatus.PLAYING) {
            this.setState({
              status: PlayerStatus.PLAYING
            });
          }
        } else if (this.state.isSeeking) {
          this.setState({ isSeeking: false });
        }

        this.setProgress({
          durationEstimate: this.audio.durationEstimate,
          duration: this.audio.duration,
          position: this.audio.position
        });

        if (this.state.karaokeMode === KaraokeMode.ON) {
          this.refs.karaoke.updateIndex(this.audio.position);
        }
      },
      onfinish: () => {
        if (this.state.repeatMode === RepeatMode.ONE) {
          this.playWithIndex(this.state.currentIndex);
        } else if (
          this.state.repeatMode === RepeatMode.ONE &&
          this.state.currentIndex === this.state.queue.length - 1
        ) {
          this.playWithIndex(0);
        } else if (
          this.state.randomMode === RandomMode.OFF &&
          this.state.repeatMode === RepeatMode.OFF &&
          this.state.currentIndex === this.state.queue.length - 1
        ) {
          //no hace nada
          // this.playWithIndex(0);
        } else if (this.state.randomMode === RandomMode.ON) {
          this.next();
        } else {
          this.next();
        }
      }
    });

    if (this.audio) {
      this.audio.play();
    }
  };

  addFavourites(ids, cb) {
    if (typeof cb === 'undefined') {
      cb = () => {
        PubSub.publish('onFavouriteSong');
      };
    }

    let favourites = this.state.favourites || [];
    if (Array.isArray(ids)) {
      favourites = favourites.concat(ids);
    } else {
      favourites.push(ids);
    }
    this.setState({ favourites: favourites }, cb);
  }

  clearFavourites() {
    this.setState({ favourites: [] }, () => {
      PubSub.publish('onFavouriteSong');
    });
  }

  isFavourite(id) {
    let favourites = this.state.favourites || [];
    return favourites.indexOf(id) !== -1;
  }

  removeFavourite(id, cb) {
    if (typeof cb === 'undefined') {
      cb = () => {
        PubSub.publish('onFavouriteSong');
      };
    }

    if (this.isFavourite(id)) {
      let favourites = this.state.favourites.filter(data => {
        return data !== id;
      });

      this.setState({ favourites: favourites }, cb);
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    //         if (prevState.favourites !== this.state.favourites) {
    //             PubSub.publish('onFavouriteSong', true);
    //         }

    if (prevState.randomMode !== this.state.randomMode) {
      Storage.set('randomMode', this.state.randomMode);
    }
    if (prevState.repeatMode !== this.state.repeatMode) {
      Storage.set('repeatMode', this.state.repeatMode);
    }
    if (prevState.queueStatus !== this.state.queueStatus) {
      Storage.set('queueStatus', this.state.queueStatus);
    }
    if (prevState.status !== this.state.status) {
      Storage.set('playerStatus', this.state.status);
      PubSub.publish('onTogglePlayerStatus', this.state.status);
    }
    if (prevState.karaokeMode !== this.state.karaokeMode) {
      Storage.set('karaokeMode', this.state.karaokeMode);
      PubSub.publish('onToggleKaraokeMode', this.state.karaokeMode);
    }
    if (prevState.miniPlayerEnabled !== this.state.miniPlayerEnabled) {
      PubSub.publish('onToggleMiniPlayerMode', this.state.miniPlayerEnabled);
    }
    if (this.state.queue) {
      let isPlayerActive = this.state.queue.length > 0;
      if (isPlayerActive !== this.context.isPlayerActive) {
        PubSub.publish('onTogglePlayerActive', isPlayerActive);
      }
    }
    if (prevState.status !== this.state.status) {
      Storage.set('status', this.state.status);
      PubSub.publish('onPlaySong', null);
    }
    if (prevState.volume !== this.state.volume) {
      if (this.state.volume > 10) {
        Storage.set('volume', this.state.volume);
      }
    }

    if (this.context.isMobile !== prevContext.isMobile) {
      if (this.context.isMobile && this.state.karaokeMode === KaraokeMode.ON) {
        this.toggleKaraokeMode();
      }
      if (this.context.isMobile && this.state.queueStatus === QueueStatus.ON) {
        this.toggleQueue();
      }

      this.setState({ miniPlayerEnabled: this.context.isMobile });
    }
  }

  showMessage(message) {
    this.getNotificationCenter().addNotification({
      message: message,
      level: 'info',
      position: 'bl',
      autoDismiss: 2
    });
  }

  getCurrentSong() {
    return this.state.queue[this.state.currentIndex];
  }

  stopAudio() {
    soundManager.stopAll();
    if (this.audio) {
      this.audio.unload();
      this.audio.destruct();
    }
  }

  setProgress(state) {
    if (this.refs.progress) {
      this.refs.progress.setState(state);
    }

    if (this.refs.time) {
      this.refs.time.setState(state);
    }

    PubSub.publish('onAudioPlayerProgress', state);
  }

  componentDidMount() {
    Storage.get('randomMode').then(data => {
      if (data !== null && data !== undefined) {
        this.setState({ randomMode: data });
      }
    });
    Storage.get('repeatMode').then(data => {
      if (data !== null && data !== undefined) {
        this.setState({ repeatMode: data });
      }
    });
    Storage.get('queueStatus').then(data => {
      if (data !== null && data !== undefined) {
        this.setState({ queueStatus: data });
      }
    });
    //Storage.get('karaokeMode').then((data)=> {
    //    if (data !== null && data !== undefined) {
    //        this.setState({karaokeMode: data});
    //        if (typeof this.props.onToggleKaraoke === 'function') {
    //            this.props.onToggleKaraoke(data);
    //        }
    //    }
    //});
    Storage.get('volume').then(data => {
      if (data !== null && data !== undefined) {
        this.setState({ volume: data });
      }
    });

    this.subscriber = PubSub.subscribe(
      'onClickLink',
      this.onClickLink.bind(this)
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  onClickLink() {
    if (this.state.karaokeMode === KaraokeMode.ON) {
      this.toggleKaraokeMode();
    }
  }

  toggleMiniPlayer() {
    let nextState = !this.state.miniPlayerEnabled;
    this.setState({
      miniPlayerEnabled: nextState
    });

    if (nextState === true && this.state.karaokeMode === KaraokeMode.ON) {
      this.toggleKaraokeMode();
    }
  }

  render() {
    let currentIndex = this.state.currentIndex || 0;
    let song = this.state.queue[currentIndex]
      ? this.state.queue[currentIndex]
      : {};

    if (this.state.queue.length < 1) {
      return <div />;
    }

    let playerClass =
      this.state.karaokeMode === KaraokeMode.ON
        ? 'app-player player karaoke-on'
        : 'app-player player';

    if (this.context.isMobile) {
      playerClass += this.state.miniPlayerEnabled ? ' mini' : ' full';
    }

    return (
      <div className={playerClass}>
        {this.context.isMobile &&
          !this.state.miniPlayerEnabled && (
            <div className="page-title primary translucent">
              <Icon
                name="arrow_back"
                onTouchTap={this.toggleMiniPlayer.bind(this)}
              />
              <div className="pull-right btn-group">
                <SongPlayerItemOptions type="player" item={song} />
              </div>
              <h1 />
            </div>
          )}

        {this.state.karaokeMode === KaraokeMode.ON && (
          <Karaoke ref="karaoke" item={song} />
        )}

        <div className="player-container">
          {this.state.miniPlayerEnabled && (
            <div
              className={
                this.props.status === PlayerStatus.OFF
                  ? 'controls disabled'
                  : 'controls'
              }
            >
              <PlayerProgressControl
                onSeekTo={this.seekTo}
                status={this.state.status}
                isSeeking={this.state.isSeeking}
                ref="progress"
              />
              <PlayerPrimaryControls
                onPlay={this.resumeOrPlay}
                onPause={this.pause}
                onNext={this.next}
                onPrev={this.prev}
                status={this.state.status}
              />
              <SongInfo
                item={song}
                size="small"
                onTouchTap={this.toggleMiniPlayer.bind(this)}
                linksEnabled={false}
                status={this.state.status}
                isSeeking={this.state.isSeeking}
              />
            </div>
          )}

          {!this.state.miniPlayerEnabled && (
            <SongInfo
              item={song}
              status={this.state.status}
              isSeeking={this.state.isSeeking}
            >
              <div className="song-options">
                <FavouriteSongPlayer
                  showTotal={true}
                  className="song-option"
                  item={song}
                />
                <ShareSongPlayer
                  showTotal={true}
                  className="song-option"
                  item={song}
                />
                <DownloadSongPlayer
                  showTotal={true}
                  className="song-option"
                  item={song}
                />
                <ListenSongPlayer
                  showTotal={true}
                  className="song-option"
                  item={song}
                />
              </div>
            </SongInfo>
          )}

          {!this.state.miniPlayerEnabled && (
            <SongItemWaveform
              item={song}
              onSeekTo={this.seekTo}
              status={this.state.status}
              isSeeking={this.state.isSeeking}
              height={100}
            />
          )}

          {!this.state.miniPlayerEnabled && (
            <div
              className={
                this.props.status === PlayerStatus.OFF
                  ? 'controls disabled'
                  : 'controls'
              }
            >
              <PlayerPrimaryControls
                onPlay={this.resumeOrPlay}
                onPause={this.pause}
                onNext={this.next}
                onPrev={this.prev}
                status={this.state.status}
              />
              <PlayerSecondaryControls
                onToggleRepeatMode={this.toggleRepeatMode}
                onToggleRandomMode={this.toggleRandomMode}
                onToggleKaraokeMode={this.toggleKaraokeMode}
                onToggleQueue={this.toggleQueue}
                repeatMode={this.state.repeatMode}
                randomMode={this.state.randomMode}
                karaokeMode={this.state.karaokeMode}
                queueStatus={this.state.queueStatus}
                hasKaraoke={song.total_karaoke > 0}
                volumeControl={
                  <PlayerVolumeControl
                    onVolumeTo={this.volumeTo}
                    volume={this.state.volume}
                  />
                }
              />
            </div>
          )}

          {this.context.isMobile &&
            !this.state.miniPlayerEnabled &&
            this.state.queueStatus === QueueStatus.ON && (
              <div className="page-title primary shadow">
                <Icon name="arrow_back" onTouchTap={this.toggleQueue} />
                <h1>Cola de reproducción</h1>
              </div>
            )}
          {!this.state.miniPlayerEnabled &&
            this.state.queueStatus === QueueStatus.ON && (
              <PlayerQueue
                queue={this.state.queue}
                status={this.state.status}
                onClickSong={this.playWithIndex}
                onRemoveSong={this.removeWithIndex}
                currentIndex={currentIndex}
              />
            )}
          {!this.state.miniPlayerEnabled && <PlayerBackground item={song} />}
        </div>
      </div>
    );
  }
}
