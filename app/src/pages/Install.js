import React from 'react';
import { PageComponent } from '../base/Component';
import { SEO } from '../util/SEO';
import { Icon } from '../components/misc/Icon';
import DocumentMeta from 'react-document-meta';
import { Loading } from '../components/misc/Loading';
import { Analytics } from '../util/Analytics';
import { Config } from '../Config';
import { RouteGenerator } from '../util/RouteGenerator';
import { Alert } from '../components/misc/Alert';
import { SEOUtil } from '../util/Util';

export class Install extends PageComponent {
  state = {
    installer: '',
    code: ''
  };

  componentDidMount() {
    this.scrollTop();
    Analytics.pageview();

    let isAndroid = !!navigator.userAgent.match(/Android/i);
    let isIOS =
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i);

    let { installer, code } = this.getParams();
    this.setState({ installer, code, isAndroid, isIOS });

    let redirectToHome = false;
    if (code) {
      if (isAndroid) {
        setTimeout(() => {
          this.context.router.replace({
            pathname: RouteGenerator.default('install/android'),
            query: { code }
          });
        }, 2 * 1000);
      } else if (isIOS) {
        setTimeout(() => {
          this.context.router.replace({
            pathname: RouteGenerator.default('install/iphone'),
            query: { code }
          });
        }, 2 * 1000);
      } else {
        redirectToHome = true;
      }
    } else if (installer) {
      redirectToHome = false;
      //nada
    } else {
      redirectToHome = true;
    }

    if (redirectToHome && !SEOUtil.isSEORequest()) {
      this.context.router.replace({
        pathname: RouteGenerator.homepage(),
        query: { code }
      });
    }
  }

  getParams() {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      url = window.location.href,
      params = {},
      match;
    try {
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
    } catch (e) {
      console.log(e);
    }
    return params;
  }

  render() {
    let { installer, code } = this.state;
    let qr = Config.server.url + '/app/installer/qr/' + code + '.png';

    return (
      <div>
        <DocumentMeta
          {...SEO.simple(
            'Instala Setbeat en tu Android ó iPhone',
            'Abre este enlace desde tu Android ó iPhone para que puedas instalar setbeat',
            ''
          )}
        />
        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />

          <h1>Instala Setbeat</h1>
        </div>
        <div>
          {installer === 'timeout' && (
            <Alert message="Ya se agotó el tiempo para que puedas usar este enlace, pide otro enlace para que puedas instalar la aplicación" />
          )}
          {installer === 'not-found' && (
            <Alert message="Este enlace no es valido" />
          )}
          {installer === 'used' && (
            <Alert message="Este enlace ya se uso anteriomente, solo puede usarse una vez" />
          )}

          {!installer && <Loading />}
        </div>
      </div>
    );
  }
}
