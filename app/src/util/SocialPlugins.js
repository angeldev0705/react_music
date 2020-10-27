import { Config } from '../Config';
import { SEOUtil } from './Util';

export class SocialPlugins {
  static parse = {
    all: function(element) {
      SocialPlugins.parse.facebook(element);
      SocialPlugins.parse.twitter(element);
      SocialPlugins.parse.google(element);
    },
    facebook: function(element) {
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse(element);
        return true;
      } else {
        return false;
      }
    },
    twitter: function(element) {
      if (typeof twttr !== 'undefined') {
        //tweetButton = new twttr.TweetButton(element);
        //tweetButton.render();
        twttr.widgets.load(element);
        return true;
      } else {
        return false;
      }
    },
    google: function(element) {
      if (typeof gapi !== 'undefined') {
        gapi.plusone.go(element);
        return true;
      } else {
        return false;
      }
    }
  };

  static init() {
    if (!SEOUtil.isSEORequest()) {
      this.initFacebook();
      this.initTwitter();
      this.initGoogle();
    }
  }

  static initFacebook() {
    (function(d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src =
        '//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=' +
        Config.facebook.appVersion +
        '&appId=' +
        Config.facebook.appId;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  static initTwitter() {
    (function(d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? 'http' : 'https';
      if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'twitter-wjs');
  }

  static initGoogle() {
    window.___gcfg = {
      lang: 'es',
      parsetags: 'explicit'
    };
    (function() {
      let po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      let s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    })();
  }
}
