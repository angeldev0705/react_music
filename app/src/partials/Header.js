import React from 'react';
import { Component } from '../base/Component';
import { Config } from '../Config';
import { RouteGenerator } from '../util/RouteGenerator';
import { Icon } from '../components/misc/Icon';
import { Link } from '../components/misc/Link';
import PubSub from 'pubsub-js';
import { SEOUtil } from '../util/Util';
import Hammer from 'hammerjs';

export class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    isMobile: React.PropTypes.bool.isRequired
  };
  state = {
    linkActive: '',
    isMenuActive: false
  };

  componentWillUnmount() {
    if (this.hammer) {
      try {
        this.hammer.off('swipeleft', this.hideHeaderBinded);
        this.hammer.off('swiperight', this.showHeaderBinded);
      } catch (e) {
        console.error(e);
      }
    }
    PubSub.unsubscribe(this.subscriber);
    PubSub.unsubscribe(this.subscriberErrorLogin);
  }

  componentDidMount() {
    this.hideHeaderBinded = this.hide.bind(this);
    this.showHeaderBinded = this.show.bind(this);
    try {
      this.hammer = new Hammer(document.body);
      this.hammer.on('swipeleft', this.hideHeaderBinded);
      this.hammer.on('swiperight', this.showHeaderBinded);
    } catch (e) {
      console.error(e);
    }

    this.subscriber = PubSub.subscribe(
      'onClickLink',
      this.checkIsActive.bind(this)
    );
    this.subscriberErrorLogin = PubSub.subscribe(
      'onToggleMenu',
      this.toggle.bind(this)
    );
  }

  checkIsActive(name, info) {
    this.setState({ linkActive: info.to });
    this.hide();
  }

  toggle() {
    this.setState({ isMenuActive: !this.state.isMenuActive });
  }

  show() {
    this.setState({ isMenuActive: true });
  }

  hide() {
    this.setState({ isMenuActive: false });
  }

  render() {
    // let activateHiddenMenuDate = new Date('Thu Sep 01 2016 21:00:00 GMT-0500 (PET)');
    // let nowDate = new Date();
    // let isValidDate = nowDate.getTime() >= activateHiddenMenuDate.getTime();
    let isValidDate = false;

    let linkActive = this.state.linkActive;
    let headerClass = this.state.isMenuActive
      ? 'app-nav header active'
      : 'app-nav header ';
    return (
      <div className={headerClass}>
        <div className="header-container">
          <div className="logo">
            <Link to={RouteGenerator.homepage()} title={Config.app.name}>
              <Icon name="speaker" />
              <span>{Config.app.name}</span>
            </Link>
          </div>

          <ul className="nav-primary">
            {this.context.isMobile && (
              <li
                className={
                  linkActive === RouteGenerator.homepage() ? 'active' : ''
                }
              >
                <Link to={RouteGenerator.homepage()}>
                  <Icon name="home" />
                  <span>Inicio</span>
                </Link>
              </li>
            )}

            {isValidDate && (
              <li
                className={
                  linkActive === RouteGenerator.liveTVMix() ? 'active' : ''
                }
              >
                <Link to={RouteGenerator.liveTVMix()}>
                  <Icon name="live_tv" />
                  <span>TVMix</span>
                </Link>
              </li>
            )}

            {SEOUtil.isSEORequest() && (
              <li className="active">
                <a
                  href="https://setbeat.com/"
                  title="Descargar Musica"
                  target="_blank"
                >
                  <Icon name="cloud_download" />
                  <span>Descargar Musica</span>
                </a>
              </li>
            )}
            <li
              className={
                linkActive === RouteGenerator.categories() ? 'active' : ''
              }
            >
              <Link to={RouteGenerator.categories()}>
                <Icon name="library_music" />
                <span>Descubrir</span>
              </Link>
            </li>
            <li
              className={linkActive === RouteGenerator.search() ? 'active' : ''}
            >
              <Link to={RouteGenerator.search()}>
                <Icon name="search" />
                <span>Buscar</span>
              </Link>
            </li>
            <li
              className={linkActive === RouteGenerator.songs() ? 'active' : ''}
            >
              <Link to={RouteGenerator.songs()}>
                <Icon name="queue_music" />
                <span>Canciones</span>
              </Link>
            </li>
            <li
              className={
                linkActive === RouteGenerator.artists() ? 'active' : ''
              }
            >
              <Link to={RouteGenerator.artists()}>
                <Icon name="mic" />
                <span>Artistas</span>
              </Link>
            </li>
            <li
              className={
                linkActive === RouteGenerator.songsNearest() ? 'active' : ''
              }
            >
              <Link to={RouteGenerator.songsNearest()}>
                <Icon name="location_on" />
                <span>Cerca de ti</span>
              </Link>
            </li>

            {!this.context.isMobile && (
              <li>
                <a href="https://uploader.setbeat.com/" target="_blank">
                  <Icon name="cloud_upload" />
                  <span>Subir Musica</span>
                </a>
              </li>
            )}

            {SEOUtil.isSEORequest() && (
              <li>
                <Link to={RouteGenerator.default('android')}>
                  <Icon name="phone_android" />
                  <span>Android</span>
                </Link>
              </li>
            )}
            {SEOUtil.isSEORequest() && (
              <li>
                <Link to={RouteGenerator.default('iphone')}>
                  <Icon name="phone_iphone" />
                  <span>iPhone</span>
                </Link>
              </li>
            )}
          </ul>

          <ul className="nav-profile">
            <li
              className={
                linkActive === RouteGenerator.default('cuenta') ? 'active' : ''
              }
            >
              <Link to={RouteGenerator.default('cuenta')}>
                <Icon name="account_box" />
                <span>Usuario</span>
              </Link>
            </li>
          </ul>
        </div>
        {this.context.isMobile && (
          <div className="header-overlay" onTouchTap={this.hide.bind(this)} />
        )}
      </div>
    );
  }
}
