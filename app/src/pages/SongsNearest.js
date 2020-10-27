import React from 'react';
import { PageComponent } from '../base/Component';
import { SongList } from '../components/song/SongList';
import { SEO } from '../util/SEO';
import { Analytics } from '../util/Analytics';
import { Icon } from '../components/misc/Icon';
import DocumentMeta from 'react-document-meta';
import PubSub from 'pubsub-js';
import Geolocation from '../middleware/Geolocation';

export class SongsNearest extends PageComponent {
  state = {
    lat: 0,
    long: 0
  };

  componentDidMount() {
    Analytics.pageview();
    Geolocation.checkWatcher();
    this.onLocationChange(null, Geolocation.getPosition());
    this.locationListener = PubSub.subscribe(
      'onLocationChange',
      this.onLocationChange.bind(this)
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.locationListener);
  }

  round(num) {
    return Math.round(num * 10000.0) / 10000.0;
  }

  onLocationChange(name, data) {
    let { latitude, longitude } = data;
    let lat = this.round(latitude);
    let long = this.round(longitude);
    this.setState({ lat, long });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;
    if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (nextState.lat !== this.state.lat) {
      update = true;
    } else if (nextState.long !== this.state.long) {
      update = true;
    }
    return update;
  }

  render() {
    let params = { ...this.state };
    __DEV__ && console.log('[SONG-NEAREST]', params);

    return (
      <div>
        <DocumentMeta
          {...SEO.simple('Canciones que estan escuchando cerca tí')}
        />
        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />
          <div className="pull-right btn-group">
            <button
              className="btn btn-default"
              onTouchTap={() => {
                this.refs.list.loadData();
              }}
            >
              <Icon name="refresh" />
              <span className="caption">Actualizar</span>
            </button>
          </div>

          <h1>Canciones cerca de ti</h1>
        </div>
        <SongList
          ref="list"
          isTop={false}
          path={'song/nearest'}
          params={params}
        />
      </div>
    );
  }
}
