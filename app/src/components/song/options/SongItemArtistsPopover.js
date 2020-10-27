import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../../base/Component';
import { Overlay, Popover } from 'react-bootstrap';
import { ElementUtil } from '../../../util/Util';
import { RouteGenerator } from '../../../util/RouteGenerator';
import { Icon } from '../../misc/Icon';
import { Link } from '../../misc/Link';

export class SongItemArtistsPopover extends Component {
  static contextTypes = {
    song: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  };

  handleClickBinded = null;

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
    this.mounted = false;
  }

  componentWillMount() {
    this.handleClickBinded = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  initListener() {
    setTimeout(() => {
      document.body.addEventListener('click', this.handleClickBinded);
    }, 700);
  }

  hide() {
    this.props.onHide();
  }

  render() {
    let item = this.context.song || {};
    let artists = item.artists || [];

    return (
      <Overlay
        show={true}
        onEntered={this.initListener.bind(this)}
        target={this.props.target}
        placement="left"
      >
        <Popover id={'popover_song_artists_' + item.id}>
          <div ref="popover" className="list-group">
            <div className="list-group-item">
              <button onClick={this.props.onShowOptions}>
                <Icon name="arrow_back" />
                <span>Regresar</span>
              </button>
            </div>
            {artists.map((artist, index) => {
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
          </div>
        </Popover>
      </Overlay>
    );
  }
}
