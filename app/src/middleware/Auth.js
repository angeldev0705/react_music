import { Storage } from '../util/Storage';
import { Request } from '../util/Request';
import PubSub from 'pubsub-js';

export class Auth {
  static profile = {};
  static queryName = 'access_token';
  static accessToken = '';

  static init() {
    Storage.get('accessToken').then(data => {
      if (data) {
        this.login(data);
      } else {
        PubSub.publish('onErrorLogin', {});
      }
    });
  }

  static login(tmpAccessToken) {
    let params = {};
    params[Auth.queryName] = tmpAccessToken;
    return Request.get('user', '', params)
      .then(data => {
        if (data) {
          this.profile = data;
          this.setAccessToken(tmpAccessToken);
          PubSub.publish('onSuccessLogin', this.profile);
        }
      })
      .catch(err => {
        PubSub.publish('onErrorLogin', err);
      });
  }

  static getProfile() {
    return this.profile || {};
  }

  static isLoggedIn() {
    return !!this.accessToken;
  }

  static getAccessToken() {
    return this.accessToken;
  }

  static setAccessToken(value) {
    this.accessToken = value;
    return Storage.set('accessToken', value);
  }

  static logout(cb) {
    this.accessToken = null;
    this.profile = null;
    PubSub.publish('onErrorLogin', {});

    return Storage.deleteKey('accessToken').then(() => {
      if (cb) {
        cb();
      }
    });
  }
}
