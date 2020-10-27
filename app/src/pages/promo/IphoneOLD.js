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
import SocialButtons from './SocialButtons';
import { Icon } from '../../components/misc/Icon';

export class IphoneOLD extends PageComponent {
  state = {
    date: new Date(),
    isMobile: false,
    showTutorial: false,
    version: 0,
    urlInstaller: ''
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
    let path = this.context.router.location.pathname;

    if (path !== '/iphone') {
      this.context.router.replace({ pathname: '/iphone' });
      return;
    }

    Analytics.pageviewSecondary();

    let isMobile =
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i);
    //isMobile = true;
    if (isMobile) {
      let version = this.getVersion();
      this.setState({ version, isMobile });
    }
    this.loadInstaller();
  }

  async loadInstaller() {
    /**  try {
            let body = await Request.get('https://api-beta.setbeat.com/v1/app/config/ios.json');
            let urlInstaller = body.updateDirectUrl || body.updateUrl;
            this.setState({urlInstaller, data: body});
        } catch (e) {
            setTimeout(() => {
                this.loadInstaller();
            }, 1000)
        }
         **/
    let urlInstaller =
      'https://updates.setbeat.com/release/ios/2.3.2/setbeat.ipa';
    let body = { urlInstaller };
    this.setState({ urlInstaller, data: body });
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

  showTutorial() {
    Analytics.eventSecondary(
      'ios',
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
              'Descargar musica para iPhone, iPod y iPad sin Jailbreak',
              'Descargar musica para iPhone , iPod ó iPad sin necesidad de Jailbreak con la aplicación de setbeat',
              'Descargar musica para iPhone,spotify premium free,premium spotify gratis,spotify free,descargar,bajar musica gratis, iPhone, iPod, iPad, canciones, bajar canciones al telefono, jailbreak, aplicación, setbeat'
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
              {_(
                'Descargar Setbeat para iOS (iPhone, iPad, iPod touch) Sin jailbreaking'
              )}
            </h1>
          </div>

          <div className={classNames(styles.videoContainer)}>
            <div className={classNames(styles.videoContent)}>
              <iframe
                width="560"
                height="349"
                src="https://www.youtube.com/embed/yGGwkvM0XjY?rel=0&hd=1&showinfo=0"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>

          {this.state.isMobile && (
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
                    'Este tutorial de instalación solo funciona desde una computadora'
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={styles.stepsContainer}>
            <p>
              Cada amante de la musica debe probar la aplicación Setbeat. En los
              últimos tiempos, esta aplicación cruzó un millón de usuarios.
              Aunque hay muchas aplicaciones de musica, la aplicación Setbeat es
              la única que ofrece un servicio Premium sin costo. Descargar
              musica para iPhone es sencillo ahora con setbeat{' '}
            </p>

            <ol>
              <li>
                Primero, descargue Cydia Impactor e instálelo en su computador
                Windows o Mac. Puede descargarlo desde el siguiente enlace.
                <div className={styles.centerContent}>
                  <a
                    className={styles.downloadButton}
                    target="_blank"
                    href={'http://www.cydiaimpactor.com/'}
                  >
                    {_('Descargar cydia impactor')}
                  </a>
                </div>
              </li>

              <li>
                Después de instalar Cydia Impactor, descargue la última versión
                de Setbeat.ipa desde aquí.
                <div className={styles.centerContent}>
                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href={this.state.urlInstaller
                      .replace(
                        'itms-services://?action=download-manifest&url=',
                        ''
                      )
                      .replace('.plist', '.ipa')}
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Descargar IPA iOS 8.1 o superior')}
                  </a>

                  <br />

                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href="https://updates.setbeat.com/release/ios/1.1.25/setbeat.ipa"
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Descargar IPA iOS 7 a 8.1')}
                  </a>

                  <br />

                  <a
                    className={styles.downloadButton}
                    onClick={this.download.bind(this)}
                    href="https://updates.setbeat.com/release/ios/1.0.15/setbeat.ipa"
                  >
                    <i
                      className={classNames('fa fa-download', styles.icon)}
                      aria-hidden="true"
                    />
                    {_('Descargar IPA iOS 6')}
                  </a>
                </div>
              </li>
              <li>
                Abre Cydia Impactor y detectará automáticamente su dispositivo.
                Usted puede ver el ejemplo en la imagen de abajo.
                <img
                  style={{ width: '100%' }}
                  src={require('./images/impactor-installer.png')}
                />
              </li>
              <li>
                Ahora, simplemente arrastre el instalador de setbeat hacia Cydia
                Impactor. A continuación, le pedirá que introduzca la dirección
                de correo electrónico y la contraseña de su cuenta de iTunes.
                <img
                  style={{ width: '100%' }}
                  src={require('./images/impactor-email.png')}
                />
                <img
                  style={{ width: '100%' }}
                  src={require('./images/impactor-password.png')}
                />
              </li>
              <li>
                La instalación se iniciará y tarda aproximadamente 2 minutos,
                luego verá la aplicación setbeat instalada en su teléfono.
              </li>
              <li>
                Ahora, debe verificar el perfil de la aplicación Setbeat iOS.
                Para ello, vaya a
                <strong>configuración</strong> > <strong>General</strong> >{' '}
                <strong>Administración de perfiles y dispositivos</strong>
                <img
                  style={{ width: '100%' }}
                  src={require('./images/profiles.png')}
                />
              </li>
              <li>
                Encuentra el perfil de la aplicación de Setbeat iOS y comprueba
                que haciendo clic en el botón de confianza.
                <img
                  style={{ width: '100%' }}
                  src={require('./images/trust.png')}
                />
              </li>
              <li>
                Eso es todo, abre la aplicación y disfruta de música gratis y
                sin Limites.
              </li>
            </ol>
          </div>

          <SocialButtons />

          <div
            className={classNames(animate.animated, animate.fadeIn, styles.seo)}
          >
            <h2>
              <a href="https://setbeat.com">Setbeat</a>{' '}
              {_(
                'es una aplicación empleada para descargar musica para iPhone y todos los dispositivos iOS'
              )}.
              {_(
                'Al reproducir las canciones tambien puede leer la letra de la canción en karaoke. con esta aplicación la musica nunca te hara falta!'
              )}
            </h2>

            <h3>
              {_(
                'Puedes Descargar cualquier cancion con calidad 320 kbps. Bajar, descargar y buscar canciones MP3 de forma gratuita en cualquier dispositivo ios ya sea iPod, iPad ó iPhone y no necesita Jailbreak. Es muy fácil y rápido. Descarga directa y con letra de karaoke en las canciones. No hay duda , la mejora aplicación que te ayudara a'
              )}
              <strong> {_('descargar musica para iphone')}</strong>{' '}
              {_('y todos los dispositivos iOS.')}
            </h3>

            <strong>{_('Musica para iPhone')}</strong>
            <br />
            <a
              title={_('Descargar musica para Android')}
              href="https://setbeat.com/android"
            >
              {_('Musica para Android')}
            </a>
            <br />

            <a title="setbeat.com" href="https://setbeat.com">
              setbeat.com
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
