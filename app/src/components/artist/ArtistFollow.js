import React from 'react';
import { Component } from '../../base/Component';
import { Request } from '../../util/Request';
import { LoginModal } from '../account/LoginModal';
import { Icon } from '../misc/Icon';
import { Loading } from '../misc/Loading';
import PubSub from 'pubsub-js';
import { Auth } from '../../middleware/Auth';

export class ArtistFollow extends Component {
  static contextTypes = {
    userProfile: React.PropTypes.object.isRequired
  };

  state = {
    isFollowing: false,
    isLoading: false,
    isPendingLogged: false,
    showLoginModal: false
  };

  componentDidMount() {
    this.subscriber = PubSub.subscribe(
      'onSuccessLogin',
      this.checkIsLogged.bind(this)
    );
    this.checkFollowing();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.subscriber);
  }

  checkFollowing() {
    //FIXME corregir
    //        let userProfile = this.context.userProfile || {};
    //        if (!userProfile.id) {
    //            this.setState({isPendingLogged: true});
    //            return;
    //        }
    if (!Auth.isLoggedIn()) {
      this.setState({ isPendingLogged: true });
      return;
    }

    let artist = this.props.item || {};

    this.setState({ isLoading: true });
    Request.get(`artist/${artist.id}/follow`, null, {}, { secure: true })
      .then(data => {
        this.setState({ isFollowing: data.following });
      })
      .catch(err => {})
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  checkIsLogged(name, data = {}) {
    if (this.state.isPendingLogged) {
      this.checkFollowing();
    }
  }

  toggle() {
    //FIXME corregir
    //        let profile = this.context.userProfile || {};
    let profile = Auth.getProfile() || {};
    if (!profile.id) {
      this.setState({ showLoginModal: true });
      return;
    }

    let artist = this.props.item || {};
    this.setState({ isLoading: true });

    if (this.state.isFollowing) {
      Request.delete(`artist/${artist.id}/follow`, {}, null, { secure: true })
        .then(data => {
          this.setState({ isFollowing: false });
        })
        .catch(err => {})
        .then(() => {
          this.setState({ isLoading: false });
        });
    } else {
      Request.post(`artist/${artist.id}/follow`, {}, null, { secure: true })
        .then(data => {
          this.setState({ isFollowing: true });
        })
        .catch(err => {})
        .then(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  hideLoginModal() {
    this.setState({ showLoginModal: false });
  }

  render() {
    let artist = this.props.item || {};

    return (
      <button className="btn btn-default" onTouchTap={this.toggle.bind(this)}>
        {!this.state.isLoading &&
          this.state.isFollowing && (
            <span>
              <Icon name="remove" /> Dejar Seguir
            </span>
          )}
        {!this.state.isLoading &&
          !this.state.isFollowing && (
            <span>
              <Icon name="add" /> Seguir
            </span>
          )}
        {this.state.isLoading && <Loading type="mini" />}
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
