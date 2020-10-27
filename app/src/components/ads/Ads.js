import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Config } from '../../Config';
import postscribe from 'postscribe';

export class Ads extends Component {
  getSize() {
    return this.props.size || '120x600';
  }

  loadAds() {
    if (!this.refs.ads) {
      return;
    }

    let node = ReactDOM.findDOMNode(this.refs.ads);
    postscribe(node, Config.ads.banners[this.getSize()], {
      done: () => {
        Config.app.debug && console.info(`[ADS]`, `${this.getSize()} loaded`);
      },
      error: function(e) {
        console.log(`[ADS]`, e);
      }
    });
  }

  componentDidMount() {
    this.loadAds();
  }

  componentWillUnmount() {
    Config.app.debug && console.info(`[ADS]`, `${this.getSize()} unloaded`);
  }

  render() {
    let size = this.getSize();
    let className = `ads ads${size}`;
    return <div className={className} ref="ads" />;
  }
}
