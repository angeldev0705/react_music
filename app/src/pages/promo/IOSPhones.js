import React, { Component } from 'react';
import classNames from 'classnames';
import animate from './Animate.scss';
import styles from './Phones.scss';
import image1 from './images/preview/ios-1.png';
import image2 from './images/preview/ios-2.png';
import image3 from './images/preview/ios-3.png';

export default class iOSPhones extends Component {
  render() {
    return (
      <div className={styles.container}>
        <img
          className={classNames(
            animate.animated,
            animate.fadeIn,
            animate.zoomInLeft,
            styles.phone,
            styles.phoneLeft
          )}
          src={image2}
          alt=""
        />
        <img
          className={classNames(
            animate.animated,
            animate.zoomInDown,
            styles.phone,
            styles.phoneCenter
          )}
          src={image1}
          alt=""
        />
        <img
          className={classNames(
            animate.animated,
            animate.zoomInRight,
            styles.phone,
            styles.phoneRight
          )}
          src={image3}
          alt=""
        />
      </div>
    );
  }
}
