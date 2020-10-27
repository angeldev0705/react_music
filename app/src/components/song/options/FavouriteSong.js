import React from 'react';
import { Component } from '../../../base/Component';
import { Icon } from '../../misc/Icon';
import { LoginModal } from '../../account/LoginModal';
import { Request } from '../../../util/Request';
import { NumberUtil } from '../../../util/Util';
import PubSub from 'pubsub-js';
import { Auth } from '../../../middleware/Auth';

export class FavouriteSong extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired,
    song: React.PropTypes.object.isRequired,
    notificationCenter: React.PropTypes.any.isRequired,
    userProfile: React.PropTypes.object.isRequired
  };

  state = {
    showLoginModal: false,
    isFavourite: false,
    isLoading: false,
    total: 0
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onFavouriteSong',
      this.checkIsFavourite.bind(this)
    );
    this.checkIsFavourite();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  toggle() {
    //FIXME corregir
    //        let profile = this.context.userProfile || {};
    let profile = Auth.getProfile() || {};
    if (!profile.id) {
      this.setState({ showLoginModal: true });
      return;
    }

    let item = this.context.song || {};
    this.setState({ isLoading: true });
    let isFavourite = this.state.isFavourite;
    let newIsFavourite = !isFavourite;
    let request = null;

    if (newIsFavourite) {
      request = Request.post(`song/${item.id}/favourite`, {}, null, {
        secure: true
      });
    } else {
      request = Request.delete(`song/${item.id}/favourite`, {}, null, {
        secure: true
      });
    }

    request
      .then(response => {
        let callback = () => {
          PubSub.publish('onFavouriteSong', {
            response: response,
            object: item
          });
        };

        if (newIsFavourite) {
          this.getPlayer().addFavourites(item.id, callback);
        } else {
          this.getPlayer().removeFavourite(item.id, callback);
        }

        let total =
          typeof response.total !== 'undefined'
            ? response.total
            : item.total_favourites || 0;
        this.setState({ total: total });
      })
      .catch(err => {
        this.setState({ isFavourite: isFavourite });
      })
      .then(() => {
        this.setState({ isLoading: false });
      });

    this.setState({ isFavourite: newIsFavourite });
  }

  setFavouriteInPlayer() {
    let item = this.context.song;

    if (!this.state.isFavourite) {
      this.getPlayer().addFavourites(item.id);
    } else {
      this.getPlayer().removeFavourite(item.id);
    }
  }

  checkIsFavourite(name, data) {
    let item = this.context.song || {};
    let response = (data && data.response) || {};
    let object = (data && data.object) || {};

    let needUpdate = object.id === item.id || !object.id;
    if (needUpdate) {
      let total =
        typeof response.total !== 'undefined'
          ? response.total
          : item.total_favourites || 0;
      let isFavourite =
        typeof response.favourite !== 'undefined'
          ? response.favourite
          : this.getPlayer().isFavourite(item.id);

      if (isFavourite !== this.state.isFavourite) {
        item.total_favourites = total;
        this.setState({ isFavourite: isFavourite, total: total });
      } else {
        item.total_favourites = total;
        this.setState({ total: total });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevContext.song.id !== this.context.song.id) {
      this.checkIsFavourite();
    }
  }

  hideLoginModal() {
    this.setState({ showLoginModal: false });
  }

  render() {
    let item = this.context.song || {};
    let className = this.props.className || '';
    className += this.state.isFavourite
      ? ' btn-favourite active '
      : ' btn-favourite ';
    let showTotal = this.props.showTotal || false;
    let total = this.state.total || 0;

    let title = !this.state.isFavourite
      ? 'Agregar a favoritos'
      : 'Eliminar de favoritos';
    let icon = this.state.isFavourite ? 'favorite' : 'favorite_border';
    return (
      <button className={className} onTouchTap={this.toggle.bind(this)}>
        <Icon name={icon} title={title} />
        {showTotal && (
          <span className="caption">{NumberUtil.format(total) || '0'}</span>
        )}
        {this.state.showLoginModal && (
          <LoginModal
            onSuccess={this.toggle.bind(this)}
            onHide={this.hideLoginModal.bind(this)}
          />
        )}
      </button>
    );
  }
}
