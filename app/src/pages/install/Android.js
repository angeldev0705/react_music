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

export class Android extends PageComponent {
  state = {
    date: new Date(),
    isMobile: false,
    version: 0
  };

  getVersion() {
    let ua = navigator.userAgent.toLowerCase();
    let match = ua.match(/android\s([0-9\.]*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  componentDidMount() {
    Analytics.pageviewSecondary();
    let isMobile = !!navigator.userAgent.match(/Android/i);
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
      'android',
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
              'Descargar musica gratis en Android | Setbeat',
              'Descargar musica gratis para Android con la aplicación de musica setbeat',
              'Descargar musica para android,spotify premium free,premium spotify gratis,spotify free,spotify apk,descargar,bajar musica gratis, canciones, bajar canciones al telefono, aplicación, setbeat'
            )}
          />

          <div className="page-title primary shadow">
            <Icon
              name="menu"
              className="menu"
              onTouchTap={this.toggleMenu.bind(this)}
            />
            <h1>Instala Setbeat en Android</h1>
          </div>

          <div className={styles.tutorialContainer}>
            <div className={styles.tutorial}>
              <strong className={styles.tutorialTitle}>
                {_('Importante')}:
              </strong>

              <p>
                <strong className={styles.alert}>
                  {_('Antes de instalar la aplicación')}
                </strong>{' '}
                {_(
                  ' verifica que tengas activado los "Orígenes Desconocidos" en tu dispositivo de lo contrario no podras descargar la aplicación:'
                )}
              </p>

              <div className={styles.snippet}>
                Configuración <span> > </span>Seguridad <span> > </span>
                Orígenes Desconocidos
              </div>

              <div>
                {_('después haz clic en el botón')}{' '}
                <strong>"{_('Descargar instalador APK')}"</strong>{' '}
                {_('que esta abajo')}
              </div>

              <div>
                {this.state.version >= 4.1 && (
                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href={urlInstaller}
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Descargar instalador APK')}
                  </a>
                )}
                {this.state.version < 4.1 && (
                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href="https://updates.setbeat.com/release/android/1.1.7/setbeat.apk"
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Descargar instalador APK')}
                  </a>
                )}

                <br />
                <br />
                <div className={styles.downloadNote}>
                  <ul>
                    <li>
                      {' '}
                      {_(
                        'Recuerda que es importante seguir las instrucciones antes de descargar'
                      )}
                    </li>

                    <li>
                      {' '}
                      {_(
                        'Si tienes problemas descargando el instalador prueba usar otros navegadores como: '
                      )}
                      <a
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=com.UCMobile.intl"
                      >
                        UC Browser
                      </a>
                    </li>

                    <li>
                      {' '}
                      {_(
                        'Si tienes problemas al abrir el instalador, prueba usando: '
                      )}
                      <a
                        target="_blank"
                        href=" https://play.google.com/store/apps/details?id=com.estrongs.android.pop"
                      >
                        ES File Explorer
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
