import React from 'react';
import PubSub from 'pubsub-js';

export class Component extends React.Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  getPlayer() {
    if (typeof this.context.player === 'function') {
      return this.context.player();
    }
    return this.context.player;
  }

  getNotificationCenter() {
    if (typeof this.context.notificationCenter === 'function') {
      return this.context.notificationCenter();
    }
    return this.context.notificationCenter;
  }

  toggleMenu() {
    PubSub.publish('onToggleMenu');
  }
}

export class PageComponent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    isLandingActive: React.PropTypes.bool.isRequired,
    player: React.PropTypes.any,
    notificationCenter: React.PropTypes.any
  };

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
