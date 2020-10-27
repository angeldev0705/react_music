import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../../base/Component';
import { SEOUtil, Util } from '../../../util/Util';
import { RouteGenerator } from '../../../util/RouteGenerator';
import { Request } from '../../../util/Request';
import { SocialPlugins } from '../../../util/SocialPlugins';
import {
  GooglePlusButton,
  SendButton,
  ShareButton,
  TwitterButton
} from '../../social/SocialWidgets';
import { Icon } from '../../misc/Icon';
import { Alert } from '../../misc/Alert';
import { Modal } from '../../misc/Modal';
import { SongInfo } from '../../song/SongInfo';
import { Ads } from '../../ads/Ads';
import { Config } from '../../../Config';
import PubSub from 'pubsub-js';

export class DownloadSongModal extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired
  };
  listener = null;
  requireFollower = false;
  state = {
    interval: 1000,
    times: 5,
    isReady: false,
    timesLeft: 0,
    downloadUrl: ''
  };

  clearListener() {
    if (this.listener) {
      clearInterval(this.listener);
    }
  }

  componentWillUnmount() {
    this.clearListener();
  }

  componentDidMount() {
    this.prepareDownload();
  }

  prepareDownload() {
    this.clearListener();
    this.listener = setInterval(() => {
      let times = this.state.times - 1;
      let isReady = times <= 0;
      if (isReady) {
        this.clearListener();
        this.setState({ isReady: isReady });
      } else {
        this.setState({ times: times });
      }
    }, this.state.interval);

    let song = this.context.song || {};

    let url = `${Config.server.url}/song/${song.id}/download/${
      song.token_stream
    }.${song.format}?u=${Math.random()}`;

    this.setState({
      downloadUrl: url
    });

    let modal = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.all(modal);
  }

  onDownload() {
    let item = this.context.song || {};

    PubSub.publish('onDownloadSong', {
      object: item,
      response: {
        total: item.total_downloads + 1
      }
    });
  }

  onShare() {
    let item = this.context.song || {};

    Request.post(`song/${item.id}/share`, {}, null, {}).then(data => {
      //FIXME no retorno el valor real del servidor porque puede demorar mucho la peticion
      PubSub.publish('onShareSong', {
        object: item,
        //                 response: data
        response: {
          total: item.total_shares
        }
      });
    });
  }

  onHide() {
    this.onShare();
    if (typeof this.props.onHide === 'function') {
      this.props.onHide();
    }
  }

  render() {
    let item = this.context.song || {};
    let shareText = `Descarga ${Util.getSongTitle(item)}`;
    let url = RouteGenerator.song(item, true);

    let modalClassName = 'download-modal';

    return (
      <Modal
        className={modalClassName}
        size="md"
        onHide={this.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <h4 className="modal-title">Descargar Canción</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-sm-12">
              <SongInfo item={item} />

              <div className="text-center">
                {!this.state.isReady && (
                  <div className="option">
                    <div className="text-center">
                      Espere unos segundos... {this.state.times}
                    </div>
                  </div>
                )}
                {this.state.isReady && (
                  <div className="option">
                    <div className="text-center">
                      {this.state.downloadUrl &&
                        this.state.downloadUrl !== 'error' && (
                          <a
                            onTouchTap={this.onDownload.bind(this)}
                            className="btn btn-lg btn-primary"
                            target="_blank"
                            href={this.state.downloadUrl}
                          >
                            Descargar canción
                          </a>
                        )}
                      {this.state.downloadUrl &&
                        this.state.downloadUrl === 'error' && (
                          <Alert message="No se encontró el enlace de descarga, intentalo más tarde" />
                        )}
                      {!this.state.downloadUrl && (
                        <span>Solo unos segundos más...</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="option">
                  {Config.ads.enabled &&
                    !SEOUtil.isSEORequest() && <Ads size="234x60" />}
                </div>
                <div className="option">
                  <SendButton href={url} layout="button_count" />
                  <ShareButton
                    href={url}
                    showFaces="false"
                    share="false"
                    layout="button_count"
                  />
                  <TwitterButton
                    href={url}
                    text={shareText}
                    hashtags="musica,descargar,gratis"
                  />
                  <GooglePlusButton href={url} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onTouchTap={this.onHide.bind(this)}
            className="btn btn-default"
          >
            Regresar
          </button>
        </div>
      </Modal>
    );
  }
}
