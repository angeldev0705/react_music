import { Config } from '../Config';
import { SEOUtil } from './Util';

export class Analytics {
  static init() {
    if (!SEOUtil.isSEORequest()) {
      (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        'script',
        '//www.google-analytics.com/analytics.js',
        'ga'
      );

      ga('create', Config.analytics.id, 'auto');
      ga('create', 'UA-62904400-1', 'auto', 'secondary');
    }

    if (!SEOUtil.isSEORequest()) {
      !(function(f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        '//connect.facebook.net/en_US/fbevents.js'
      );
      fbq('init', '530620477112722');
    }
  }

  static pageview(path) {
    setTimeout(function() {
      window.prerenderReady = true;
    }, 1000);

    if (!path) {
      path = window.location.pathname;
    }

    try {
      if (typeof ga === 'function') {
        ga('send', 'pageview', path);
      }
      if (typeof fbq === 'function') {
        fbq('track', 'PageView');
      }
    } catch (e) {
      console.error(e);
    }
  }

  static pageviewSecondary(path) {
    setTimeout(function() {
      window.prerenderReady = true;
    }, 1000);

    if (!path) {
      path = window.location.pathname;
    }

    try {
      if (typeof ga === 'function') {
        ga('secondary.send', 'pageview', path);
      }
      if (typeof fbq === 'function') {
        fbq('track', 'PageView');
      }
    } catch (e) {
      console.error(e);
    }
  }

  static modalview(path) {
    if (typeof ga === 'function') {
      ga('send', 'modalview', path);
    }
  }

  static event(data, params = {}) {
    if (typeof ga === 'function') {
      ga('send', 'event', {
        category: 'music',
        action: data
      });
    }
  }

  static eventSecondary(category = '', action = '', label = '', value = 0) {
    if (typeof ga === 'function') {
      ga('secondary.send', 'event', category, action, label, value);
    }
  }
}
