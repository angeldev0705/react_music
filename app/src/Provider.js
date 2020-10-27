import React from 'react';
import PubSub from 'pubsub-js';
import { Auth } from './middleware/Auth';
import { PlayerStatus } from './components/player/Player';
import { KaraokeMode } from './components/player/Karaoke';
import $ from 'jquery';
import Geolocation from './middleware/Geolocation';

export class Provider extends React.Component {
  static childContextTypes = {
    isMobile: React.PropTypes.bool,
    isPlayerActive: React.PropTypes.bool,
    isLandingActive: React.PropTypes.bool,
    userProfile: React.PropTypes.object,
    karaokeMode: React.PropTypes.number,
    playerStatus: React.PropTypes.number
  };
  state = {
    karaokeMode: KaraokeMode.OFF,
    playerStatus: PlayerStatus.STOPPED,
    isMobile: false,
    isPlayerActive: false,
    isLandingActive: false,
    userProfile: {}
  };
  shouldScrollBottom = 0;

  getChildContext() {
    return {
      isMobile: this.state.isMobile,
      isPlayerActive: this.state.isPlayerActive,
      isLandingActive: this.state.isLandingActive,
      userProfile: this.state.userProfile,
      karaokeMode: this.state.karaokeMode,
      playerStatus: this.state.playerStatus
    };
  }

  componentWillMount() {
    this.subscriberLandingActive = PubSub.subscribe(
      'onToggleLandingActive',
      this.toggleLandingActive.bind(this)
    );
    this.subscriber = PubSub.subscribe(
      'onSuccessLogin',
      this.checkIsLogged.bind(this)
    );
    this.subscriberErrorLogin = PubSub.subscribe(
      'onErrorLogin',
      this.checkIsLogged.bind(this)
    );
    this.subscriberKaraokeMode = PubSub.subscribe(
      'onToggleKaraokeMode',
      this.toggleKaraokeMode.bind(this)
    );
    this.subscriberPlayerStatus = PubSub.subscribe(
      'onTogglePlayerStatus',
      this.togglePlayerStatus.bind(this)
    );
    this.subscriberPlayerActive = PubSub.subscribe(
      'onTogglePlayerActive',
      this.togglePlayerActive.bind(this)
    );
    this.subscriberMiniPlayerMode = PubSub.subscribe(
      'onToggleMiniPlayerMode',
      this.toggleMiniPlayerMode.bind(this)
    );
  }

  componentDidMount() {
    Geolocation.init();
    this.handleResizeBinded = this.handleResize.bind(this);
    this.handleResize();
    window.addEventListener('resize', this.handleResizeBinded);
  }

  toggleMiniPlayerMode(name, value) {
    if (!value) {
      $('body').addClass('player-fullscreen');
    } else {
      $('body').removeClass('player-fullscreen');
    }
  }

  togglePlayerActive(name, value) {
    this.setState({ isPlayerActive: value });
  }

  toggleLandingActive(name, value) {
    this.setState({ isLandingActive: value });
  }

  togglePlayerStatus(name, value) {
    this.setState({ playerStatus: value });
  }

  toggleKaraokeMode(name, value) {
    this.setState({ karaokeMode: value });
  }

  componentWillUnmount() {
    Geolocation.destroy();
    window.removeEventListener('resize', this.handleResizeBinded);
    PubSub.unsubscribe(this.subscriber);
    PubSub.unsubscribe(this.subscriberErrorLogin);
    PubSub.unsubscribe(this.subscriberKaraokeMode);
    PubSub.unsubscribe(this.subscriberPlayerStatus);
    PubSub.unsubscribe(this.subscriberPlayerActive);
    PubSub.unsubscribe(this.subscriberLandingActive);
    PubSub.unsubscribe(this.subscriberMiniPlayerMode);
  }

  checkIsMobile() {
    let isMobile = false;
    let innerWidth =
      window.innerWidth ||
      document.body.offsetWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (innerWidth <= 768) {
      isMobile = true;
    }
    return isMobile;
  }

  componentWillUpdate() {
    let node = document.body;
    this.shouldScrollBottom = node.scrollTop;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      let node = document.body;
      node.scrollTop = this.shouldScrollBottom;
    }
  }

  handleResize() {
    if (this.listener) {
      clearTimeout(this.listener);
    }
    this.listener = setTimeout(() => {
      let isMobile = this.checkIsMobile();
      if (this.state.isMobile !== isMobile) {
        this.setState({ isMobile: isMobile });
      }
    }, 50);
  }

  checkIsLogged() {
    let profile = Auth.getProfile();
    this.setState({ userProfile: profile });
  }

  render() {
    return this.props.children;
  }
}
