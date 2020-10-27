import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../../base/Component';
import { Util } from '../../../util/Util';
import { RouteGenerator } from '../../../util/RouteGenerator';
import {
  GooglePlusButton,
  SendButton,
  ShareButton,
  TwitterButton
} from '../../social/SocialWidgets';
import { Icon } from '../../misc/Icon';
import { Modal } from '../../misc/Modal';
import { SongInfo } from '../../song/SongInfo';
import Clipboard from 'clipboard';
import PubSub from 'pubsub-js';
import { Request } from '../../../util/Request';

export class ShareSongModal extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  clipboard = null;
  state = {};

  selectLink() {
    ReactDOM.findDOMNode(this.refs.urlInput).select();
  }

  linkCopied() {
    this.getNotificationCenter().addNotification({
      message: 'Enlace Copiado al portapales',
      level: 'info',
      position: 'bl',
      autoDismiss: 2
    });
  }

  linkCopiedFallback() {
    this.selectLink();
    this.getNotificationCenter().addNotification({
      message: 'Ahora solo presiona CTRL + C',
      level: 'info',
      position: 'bl',
      autoDismiss: 2
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  componentDidMount() {
    let item = this.context.song || {};
    let url = RouteGenerator.song(item, true);
    this.clipboard = new Clipboard(`.copy-link`, {
      text: function(trigger) {
        return url;
      }
    });

    let urlInput = ReactDOM.findDOMNode(this.refs.urlInput);
    urlInput.value = url;

    this.clipboard.on('success', e => {
      this.linkCopied();
    });

    this.clipboard.on('error', e => {
      this.linkCopiedFallback();
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

    return (
      <Modal
        className="share-modal"
        size="md"
        show={true}
        onHide={this.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <h4 className="modal-title">Compartir canción</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-sm-12">
              <SongInfo item={item} />

              <div className="text-center">
                <div className="option">
                  <p>
                    Comparte esta canción con tus amigos usando los botones
                    sociales:
                  </p>

                  <div>
                    <SendButton href={url} layout="box_count" />
                    <ShareButton
                      href={url}
                      showFaces="false"
                      action="recommend"
                      showShare="false"
                      layout="box_count"
                    />
                    <TwitterButton
                      href={url}
                      text={shareText}
                      count="vertical"
                      hashtags="musica,descargar,gratis"
                    />
                    <GooglePlusButton href={url} size="tall" />
                  </div>
                </div>

                <div className="option">
                  <p>Copia el enlace y envialo directamente:</p>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        onTouchTap={this.selectLink.bind(this)}
                        ref="urlInput"
                        className="form-control input-md"
                        readOnly={true}
                      />
                      <span className="input-group-btn">
                        <button className="btn btn-default copy-link">
                          Copiar enlace
                        </button>
                      </span>
                    </div>
                  </div>
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
