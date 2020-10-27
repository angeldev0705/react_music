import React from 'react';
import { PageComponent } from './base/Component';
import { Ads } from './components/ads/Ads';
import { Header } from './partials/Header';
import { Footer } from './partials/Footer';
import { Config } from './Config';
import { Player } from './components/player/Player';
import { KaraokeMode } from './components/player/Karaoke';
import NotificationSystem from 'react-notification-system';

export class App extends PageComponent {
  static contextTypes = {
    karaokeMode: React.PropTypes.number.isRequired,
    playerStatus: React.PropTypes.number.isRequired,
    isPlayerActive: React.PropTypes.bool.isRequired,
    isLandingActive: React.PropTypes.bool.isRequired
  };

  static childContextTypes = {
    player: React.PropTypes.any,
    notificationCenter: React.PropTypes.any
  };

  getChildContext() {
    return {
      player: this.getPlayer.bind(this),
      notificationCenter: this.getNotificationCenter.bind(this)
    };
  }

  getPlayer() {
    return this.refs.player;
  }

  getNotificationCenter() {
    return this.refs.notificationCenter;
  }

  render() {
    let notificationCenterStyle = {
      NotificationItem: {
        DefaultStyle: {}
      }
    };

    //if(!SEOUtil.isSEORequest()){
    //    return <h1 style={{textAlign:'center'}}>... en mantenimiento, volveremos mañana ...</h1>
    //}

    return (
      <div className="app" ref="app">
        <div className="app-container">
          <Header ref="header" />

          <div
            className={
              this.context.karaokeMode === KaraokeMode.ON
                ? 'app-content hidden'
                : 'app-content'
            }
          >
            <div className="app-content-main">{this.props.children}</div>
            <Footer />
          </div>

          <Player ref="player" />
        </div>

        {Config.ads.enabled &&
          this.context.isMobile && <Ads size="interstitial" />}
        <NotificationSystem
          ref="notificationCenter"
          style={notificationCenterStyle}
        />
      </div>
    );
  }
}
