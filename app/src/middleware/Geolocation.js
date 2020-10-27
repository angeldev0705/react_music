import PubSub from 'pubsub-js';

export default class Geolocation {
  static lastPosition = {};
  static initialPosition = {};

  static watchID: ?number = null;

  static async init() {
    //this.checkWatcher(false)
  }

  static getPosition() {
    __DEV__ && console.log('[GEOLOCATION]', 'getPosition');
    return (
      this.lastPosition.coords ||
      this.initialPosition.coords || { latitude: 0, longitude: 0 }
    );
  }

  static async checkWatcher(forced: boolean = true) {
    __DEV__ && console.log('[GEOLOCATION]', 'checkWatcher', forced);
    let allowed = await this.isAllowedToCheck();
    if (!allowed && forced) {
      allowed = await this.requestPermission();
    }
    if (allowed) {
      this.initWatcher();
    }
  }

  static async requestPermission() {
    __DEV__ && console.log('[GEOLOCATION]', 'requestPermission');
    return true;
  }

  static async isAllowedToCheck(): Promise<boolean> {
    __DEV__ && console.log('[GEOLOCATION]', 'isAllowedToCheck');
    return true;
  }

  static destroy() {
    try {
      navigator.geolocation.clearWatch(this.watchID);
    } catch (e) {
      __DEV__ && console.warn(e);
    }
  }

  static initWatcher() {
    __DEV__ && console.log('[GEOLOCATION]', 'initWatcher');

    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
    this.updateLocation();
    try {
      this.watchID = navigator.geolocation.watchPosition(lastPosition => {
        this.lastPosition = lastPosition;
        let coords = lastPosition.coords || {};

        PubSub.publish('onLocationChange', coords);
        __DEV__ &&
          console.log('[GEOLOCATION]', 'navigator', 'watchPosition', coords);
      });
    } catch (e) {
      __DEV__ && console.warn(e);
    }
  }

  static updateLocation() {
    __DEV__ && console.log('[GEOLOCATION]', 'updateLocation');
    try {
      navigator.geolocation.getCurrentPosition(
        initialPosition => {
          this.initialPosition = initialPosition;
          let coords = initialPosition.coords || {};

          PubSub.publish('onLocationChange', coords);
          __DEV__ &&
            console.log(
              '[GEOLOCATION]',
              'navigator',
              'getCurrentPosition',
              coords
            );
        },
        error => {
          __DEV__ && console.warn(error);
        },
        {}
      );
    } catch (e) {
      __DEV__ && console.warn(e);
    }
  }
}
