import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import DocumentMeta from 'react-document-meta';
import { Analytics } from '../../util/Analytics';
import { _ } from '../../languages/Translator';
import classNames from 'classnames';
import styles from './Home.scss';
import { Icon } from '../../components/misc/Icon';
import { Config } from '../../Config';
import { RouteGenerator } from '../../util/RouteGenerator';

export class Iphone extends PageComponent {
  state = {
    date: new Date(),
    isMobile: false,
    version: 0
  };

  getVersion() {
    if (window.MSStream) {
      // There is some iOS in Windows Phone...
      // https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
      return false;
    }
    let match = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
      version;

    if (match !== undefined && match !== null) {
      version = [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3] || 0, 10)
      ];
      return parseFloat(version.join('.'));
    }

    return false;
  }

  componentDidMount() {
    Analytics.pageviewSecondary();

    let isMobile =
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i);
    if (isMobile) {
      let version = this.getVersion();
      this.setState({ version, isMobile });
    }
    let { code } = this.getParams();
    this.setState({ code });
    if (!code || !isMobile) {
      this.context.router.replace({
        pathname: RouteGenerator.homepage(),
        query: { code }
      });
    }
  }

  getDiffTime() {
    let currentDate = new Date();
    return currentDate.getTime() - this.state.date.getTime();
  }

  download() {
    Analytics.eventSecondary(
      'ios',
      'download-installer',
      'step2',
      this.getDiffTime()
    );
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
    let { code } = this.state;
    // let qr = Config.server.url + '/app/installer/qr/' + code + '.png';
    let urlInstaller = Config.server.url + '/app/installer/open/' + code;

    return (
      <div className="row">
        <div className={styles.container}>
          <DocumentMeta
            {...SEO.simple(
              'Descargar musica para iPhone, iPod y iPad sin Jailbreak',
              'Descargar musica para iPhone , iPod ó iPad sin necesidad de Jailbreak con la aplicación de setbeat',
              'Descargar musica para iPhone,spotify premium free,premium spotify gratis,spotify free,descargar,bajar musica gratis, iPhone, iPod, iPad, canciones, bajar canciones al telefono, jailbreak, aplicación, setbeat'
            )}
          />

          <div className="page-title primary shadow">
            <Icon
              name="menu"
              className="menu"
              onTouchTap={this.toggleMenu.bind(this)}
            />
            <h1>Instala Setbeat en iPhone</h1>
          </div>

          <div className={styles.stepsContainer}>
            <p>Antes de instalar asegurate de leer las instrucciones: </p>

            <ol>
              <li>
                Has clic en el botón "Instalar" para comenzar la instalación.
                <div className={styles.centerContent}>
                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href={urlInstaller}
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Instalar para iOS 8.1 o superior')}
                  </a>

                  {/*<br/>*/}

                  {/*<a className={styles.downloadButton}*/}
                  {/*onClick={this.download.bind(this)}*/}
                  {/*href="https://updates.setbeat.com/release/ios/1.1.25/setbeat.ipa">*/}
                  {/*<i className={classNames('fa fa-download', styles.icon)} aria-hidden="true"></i>*/}
                  {/*{_('Descargar IPA iOS 7 a 8.1')}*/}
                  {/*</a>*/}

                  {/*<br/>*/}

                  {/*<a className={styles.downloadButton}*/}
                  {/*onClick={this.download.bind(this)}*/}
                  {/*href="https://updates.setbeat.com/release/ios/1.0.15/setbeat.ipa">*/}
                  {/*<i className={classNames('fa fa-download', styles.icon)} aria-hidden="true"></i>*/}
                  {/*{_('Descargar IPA iOS 6')}*/}
                  {/*</a>*/}
                </div>
              </li>
              <li>Verás un mensaje que pide confirmar la instalación.</li>
              <li>
                Se comenzará a instalar en la pantalla principal de tu
                dispositivo.
              </li>

              <li>
                Después que se haya instalado la aplicación, entra a la
                configuracion de tu dispositivo siguiendo los pasos que estan a
                continuación:
                <div className={styles.snippet}>
                  Ajustes <span> > </span>General <span> > </span>{' '}
                  Administración de perfiles y dispositivos <span> > </span>
                  Cryptoatm
                </div>
                <img
                  style={{ width: '100%' }}
                  src={require('./images/profiles.png')}
                />
              </li>
              <li>
                Tocas el boton "confiar", aceptas el mensaje y ya podras usar la
                aplicación.
              </li>
              <li>
                Eso es todo, abre la aplicación y disfruta de música gratis y
                sin Limites.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
