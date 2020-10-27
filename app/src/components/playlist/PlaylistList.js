import React from 'react';
import { ListComponent } from '../base/ListComponent';
import { PlaylistItem } from './PlaylistItem';
import { Loading } from '../misc/Loading';
import { Ads } from '../ads/Ads';
import { Empty } from '../misc/Empty';
import { Config } from '../../Config';
import { SEOUtil } from '../../util/Util';

export class PlaylistList extends ListComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  loadData(preProps) {
    let props = preProps || this.props;
    let path = ``;
    let params = props.params || {};
    let config = {};
    let id;
    if (props.query) {
      path = `playlist/filter?query=${props.query}`;
      id = 'search_playlists';
    }

    config.secure = !!props.secure;
    this.loadDataFromPath(path, id, params, config);
  }

  componentWillReceiveProps(nextProps) {
    let loadAgain = false;
    if (nextProps.query !== this.props.query) {
      loadAgain = true;
    } else if (nextProps.page !== this.props.page) {
      loadAgain = true;
    } else if (nextProps.path !== this.props.path) {
      loadAgain = true;
    } else if (nextProps.secure !== this.props.secure) {
      loadAgain = true;
    }

    if (loadAgain) {
      this.loadData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;

    if (nextState.isLoading !== this.state.isLoading) {
      update = true;
    } else if (nextProps.hideAds !== this.props.hideAds) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    }

    return update;
  }

  render() {
    return (
      <div>
        {Config.ads.enabled &&
          !this.props.hideAds &&
          !SEOUtil.isSEORequest() &&
          this.context.isMobile && <Ads size="320x50" />}
        <div className="col-sm-12">
          {Config.ads.enabled &&
            !this.props.hideAds &&
            !this.props.hideTopAds &&
            !SEOUtil.isSEORequest() &&
            !this.context.isMobile && (
              <div className="row">
                <Ads size="728x90" />
              </div>
            )}
          <div className="row playlist-list-container">
            <div className=" playlist-list">
              {this.state.results.map(item => (
                <div className="col-sm-6 col-lg-3 col-xl-3" key={item.id}>
                  <PlaylistItem item={item} />
                </div>
              ))}

              {this.state.isLoading && <Loading />}
              {!this.state.isLoading &&
                this.state.results.length === 0 && (
                  <Empty message="No se encontraron playlists" />
                )}
            </div>

            {Config.ads.enabled &&
              !this.props.hideAds &&
              !SEOUtil.isSEORequest() &&
              !this.context.isMobile && <Ads size="160x600" />}
          </div>
        </div>
      </div>
    );
  }
}
