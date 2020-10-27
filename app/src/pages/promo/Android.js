import React from 'react';
import { PageComponent } from '../../base/Component';
import { SEO } from '../../util/SEO';
import DocumentMeta from 'react-document-meta';
import { Analytics } from '../../util/Analytics';
import { findDOMNode } from 'react-dom';
import { _ } from '../../languages/Translator';
import classNames from 'classnames';
import animate from './Animate.scss';
import styles from './Home.scss';
import logo from './images/logo/logo_text_inverted.png';
import AndroidPhones from './AndroidPhones';
import SocialButtons from './SocialButtons';
import { Icon } from '../../components/misc/Icon';
import { Request } from '../../util/Request';

export class Android extends PageComponent {
  state = {
    date: new Date(),
    isMobile: false,
    showTutorial: false,
    version: 0,
    urlInstaller: ''
  };

  getVersion() {
    let ua = navigator.userAgent.toLowerCase();
    let match = ua.match(/android\s([0-9\.]*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  componentDidMount() {
    let path = this.context.router.location.pathname;

    if (path !== '/android') {
      this.context.router.replace({ pathname: '/android' });
      return;
    }

    Analytics.pageviewSecondary();

    let isMobile = !!navigator.userAgent.match(/Android/i);
    if (isMobile) {
      let version = this.getVersion();
      this.setState({ version, isMobile });
      this.loadInstaller();
    }
  }

  async loadInstaller() {
    try {
      let body = await Request.get(
        'https://api-beta.setbeat.com/v1/app/config/android.json'
      );
      let urlInstaller = body.updateDirectUrl || body.updateUrl;
      this.setState({ urlInstaller, data: body });
    } catch (e) {
      setTimeout(() => {
        this.loadInstaller();
      }, 1000);
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

  showTutorial() {
    Analytics.eventSecondary(
      'android',
      'show-tutorial',
      'step1',
      this.getDiffTime()
    );
    this.setState({ showTutorial: true }, () => {
      setTimeout(() => {
        this.showDownload();
      }, 3 * 1000);

      if (this.tutorial) {
        findDOMNode(this.tutorial).scrollIntoView();
      }
    });
  }

  showDownload() {
    this.setState({ showDownload: true });
  }

  render() {
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

          {this.context.isMobile && (
            <div className="page-title primary shadow">
              <Icon
                name="menu"
                className="menu"
                onTouchTap={this.toggleMenu.bind(this)}
              />
              <h1 />
            </div>
          )}

          <div className={classNames(animate.animated, animate.fadeIn)}>
            <img className={classNames(styles.logo)} src={logo} alt="" />

            <h1 className={styles.title}>
              {_('Descargar musica para Android')}
            </h1>
          </div>
          <div>
            <AndroidPhones />
          </div>
          {!this.state.isMobile && (
            <div>
              <div
                className={classNames(
                  animate.animated,
                  animate.fadeIn,
                  styles.noMobile
                )}
              >
                <div>
                  {_(
                    'Para instalar la aplicación debes entrar la siguiente url desde tu dispositivo Android'
                  )}
                </div>
                <a href="https://setbeat.com/android">
                  https://setbeat.com/android
                </a>
              </div>

              <div>
                <a className={styles.link} href="https://setbeat.com/iphone">
                  {_('¿Tu dispositivo es iOS?, click aqui')}
                </a>
              </div>
            </div>
          )}
          {this.state.isMobile && (
            <div>
              <button
                className={classNames(styles.installButton)}
                onClick={this.showTutorial.bind(this)}
              >
                <i
                  className={classNames('fa fa-android', styles.icon)}
                  aria-hidden="true"
                />
                <span>{_('Instalar aplicación para Android')}</span>
              </button>
            </div>
          )}
          {this.state.showTutorial && (
            <div
              ref={ref => {
                this.tutorial = ref;
              }}
              className={styles.tutorialContainer}
            >
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

                {!this.state.showDownload && (
                  <div>
                    <span>...</span>
                    <br />
                    <strong>{_('Por favor lee las instrucciones')}</strong>
                  </div>
                )}

                {this.state.showDownload && (
                  <div>
                    {this.state.version >= 4.1 && (
                      <a
                        className={styles.downloadButton}
                        onClick={this.download.bind(this)}
                        href={this.state.urlInstaller}
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
                )}
              </div>
            </div>
          )}

          <SocialButtons />

          <div
            className={classNames(animate.animated, animate.fadeIn, styles.seo)}
          >
            <h2>
              <a href="https://setbeat.com">Setbeat</a>{' '}
              {_(
                'es una aplicación empleada para descargar musica para Android. Al reproducir las canciones tambien puede leer la letra de la canción en karaoke. Con esta aplicación la musica nunca te hara falta!'
              )}
            </h2>

            <h3>
              {_(
                'Puedes Descargar cualquier cancion con calidad 320 kbps. Bajar, escuchar y buscar canciones MP3 de forma gratuita en cualquier dispositivo. Podras'
              )}
              <strong> {_('descargar musica para Android')}</strong>.{' '}
              {_(
                'Es muy fácil y rápido. Descarga directa y con letra de karaoke en las canciones. No hay duda , la mejor aplicación de musica para android'
              )}
            </h3>

            <strong>{_('Musica para Android')}</strong>
            <br />
            <a
              title={_('Descargar musica para iPhone')}
              href="https://setbeat.com/iphone"
            >
              {_('Musica para iPhone')}
            </a>
            <br />

            <a title="Generos de musica" href="https://setbeat.com/generos">
              Generos de musica
            </a>
          </div>

          <div
            className={classNames(
              animate.animated,
              animate.fadeIn,
              styles.fallbackContainer
            )}
          >
            <div className={styles.fallbackMessage}>
              {_(
                'Si no puedes instalar la aplicación puedes entrar a nuestro sitio web'
              )}
            </div>
            <a className={styles.link} href={'https://setbeat.com'}>
              {_('Entrar al sitio web')}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
