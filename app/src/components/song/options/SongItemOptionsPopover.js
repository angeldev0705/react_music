import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../../base/Component';
import { Overlay, Popover } from 'react-bootstrap';
import { ElementUtil } from '../../../util/Util';
import { RouteGenerator } from '../../../util/RouteGenerator';
import { Icon } from '../../misc/Icon';
import { Link } from '../../misc/Link';
import Clipboard from 'clipboard';

export class SongItemOptionsPopover extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired,
    router: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired
  };

  static seed = 0;

  clipboard = null;
  idCopy = '';
  handleClickBinded = null;

  state = {
    canCopy: false
  };

  construct() {}

  handleClick(e) {
    let popover = ReactDOM.findDOMNode(this.refs.popover);
    let isChild = ElementUtil.isChildOf(e.target, popover);

    if (!(isChild || e.target === popover)) {
      this.hide();
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClickBinded);
    this.clipboard.destroy();
    this.mounted = false;
  }

  componentWillMount() {
    this.idCopy = `copy_url_song_${SongItemOptionsPopover.seed}`;
    SongItemOptionsPopover.seed++;
    this.handleClickBinded = this.handleClick.bind(this);
  }

  initListener() {
    setTimeout(() => {
      document.body.addEventListener('click', this.handleClickBinded);
    }, 700);
  }

  componentDidMount() {
    this.mounted = true;

    //FIXME verificar si el navegador soporta el copiar texto
    if (
      typeof document.execCommand !== 'undefined' &&
      typeof window.getSelection !== 'undefined'
    ) {
      //this.setState({canCopy: true});

      //console.log(window.getSelection);
      //console.log(document.execCommand);

      let item = this.context.song || {};
      let url = RouteGenerator.song(item, true);

      this.clipboard = new Clipboard(`#${this.idCopy}`, {
        text: function(trigger) {
          return url;
        }
      });

      this.clipboard.on('success', e => {
        this.linkCopied();
      });

      this.clipboard.on('error', e => {
        this.linkCopiedFallback();
      });
    }
  }

  linkCopiedFallback() {
    this.getNotificationCenter().addNotification({
      message: 'Prueba actualizando tu navegador',
      level: 'warning',
      position: 'bl',
      autoDismiss: 2
    });

    this.hide();
  }

  linkCopied() {
    this.getNotificationCenter().addNotification({
      message: 'Enlace Copiado al portapales',
      level: 'info',
      position: 'bl',
      autoDismiss: 2
    });
    this.hide();
  }

  playNow() {
    let item = this.context.song || {};
    this.getPlayer().addAndReplaceCurrent(item, true);
    this.getNotificationCenter().addNotification({
      message: 'La canción se reproducirá ahora',
      level: 'success',
      position: 'bl',
      autoDismiss: 2
    });
    this.hide();
  }

  playNext() {
    let item = this.context.song || {};
    this.getPlayer().addToNext(item);
    //this.getNotificationCenter().addNotification({
    //    message: 'La canción se reproducirá despues de la actual',
    //    level: 'success',
    //    position: 'bl',
    //    autoDismiss: 2
    //});
    this.hide();
  }

  playEnd() {
    let item = this.context.song || {};
    this.getPlayer().addToEnd(item);
    //this.getNotificationCenter().addNotification({
    //    message: 'La canción se reproducirá al final',
    //    level: 'success',
    //    position: 'bl',
    //    autoDismiss: 2
    //});
    this.hide();
  }

  hide() {
    this.props.onHide();
  }

  render() {
    let item = this.context.song || {};
    let artists = item.artists || [];
    let type = this.props.type || 'default';

    return (
      <Overlay
        show={true}
        onEntered={this.initListener.bind(this)}
        target={this.props.target}
        placement="left"
      >
        <Popover id={'popover_song_' + item.id}>
          <div ref="popover" className="list-group">
            <div className="list-group-item">
              <button onClick={this.props.onShowAddToPlaylistModal}>
                <Icon name="add" />
                <span>Agregar a Playlist</span>
              </button>
            </div>
            {(type === 'default' || type === 'queue') && (
              <div className="list-group-item">
                <button onTouchTap={this.playNow.bind(this)}>
                  <Icon name="play_arrow" />
                  <span>Reproducir Ahora</span>
                </button>
              </div>
            )}
            {type === 'default' && (
              <div className="list-group-item">
                <button onTouchTap={this.playNext.bind(this)}>
                  <Icon name="playlist_add" />
                  <span>Reproducir a continuacion</span>
                </button>
              </div>
            )}
            {type === 'default' && (
              <div className="list-group-item">
                <button onTouchTap={this.playEnd.bind(this)}>
                  <Icon name="playlist_add" />
                  <span>Reproducir al final</span>
                </button>
              </div>
            )}
            <div className="list-group-item">
              <button onClick={this.props.onShowDownloadModal}>
                <Icon name="cloud_download" />
                <span>Descargar</span>
              </button>
            </div>
            <div className="list-group-item">
              <button onClick={this.props.onShowShareModal}>
                <Icon name="share" />
                <span>Compartir</span>
              </button>
            </div>
            {this.state.canCopy && (
              <div className="list-group-item">
                <button id={this.idCopy}>
                  <Icon name="content_copy" />
                  <span>Copiar enlace</span>
                </button>
              </div>
            )}
            {artists.length <= 1 &&
              artists.map((artist, index) => {
                return (
                  <div key={artist.id} className="list-group-item">
                    <Link
                      to={RouteGenerator.artist(artist)}
                      onTouchTap={this.hide.bind(this)}
                    >
                      <Icon name="album" />
                      <span>Ir a {artist.name}</span>
                    </Link>
                  </div>
                );
              })}
            {artists.length > 1 && (
              <div className="list-group-item">
                <button onClick={this.props.onShowGoToArtists}>
                  <Icon name="album" />
                  <span>Ir al Artista...</span>
                </button>
              </div>
            )}
          </div>
        </Popover>
      </Overlay>
    );
  }
}
