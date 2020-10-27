import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './SocialButtons.scss';
import { _ } from '../../languages/Translator';
import animate from './Animate.scss';

export default class SocialButtons extends Component {
  render() {
    return (
      <div
        className={classNames(animate.animated, animate.fadeIn, styles.social)}
      >
        <hr />
        <strong>{_('Visitanos en nuestras redes sociales')}</strong>

        <div className={styles.socialLinks}>
          <a
            target="_blank"
            title={_('Perfil de Facebook')}
            href="https://facebook.com/setbeat"
          >
            <i
              className={classNames('fa fa-facebook-official', styles.facebook)}
              aria-hidden="true"
            />
          </a>

          <a
            target="_blank"
            title={_('Perfil de Twitter')}
            href="https://twitter.com/Setbeat"
          >
            <i
              className={classNames('fa fa-twitter-square', styles.twitter)}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    );
  }
}
