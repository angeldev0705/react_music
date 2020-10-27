import React from 'react';
import { ListComponent } from '../base/ListComponent';
import { Loading } from '../misc/Loading';
import { Empty } from '../misc/Empty';
import { Ads } from '../ads/Ads';
import { Config } from '../../Config';
import { SEOUtil } from '../../util/Util';
import { ArtistItem } from './ArtistItem';
import { AdsFlexible } from '../ads/AdsFlexible';

export class ArtistList extends ListComponent {
  static contextTypes = {
    userProfile: React.PropTypes.object.isRequired,
    player: React.PropTypes.any.isRequired,
    isMobile: React.PropTypes.bool.isRequired
  };

  loadData(preProps) {
    let props = preProps || this.props;
    let path = ``;
    let params = props.params || {};
    let config = {};
    let id;
    if (props.genreId) {
      path = `genre/${props.genreId}/artists`;
      id = 'genre_artists';
    } else if (props.query) {
      path = `artist/filter?query=${props.query}`;
      id = 'search_artists';
    }

    config.secure = !!props.secure;
    this.loadDataFromPath(path, id, params, config);
  }

  componentWillReceiveProps(nextProps) {
    let loadAgain = false;
    if (nextProps.query !== this.props.query) {
      loadAgain = true;
    } else if (nextProps.genreId !== this.props.genreId) {
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
    //else if (nextProps.query !== this.props.query) {
    //    update = true;
    //} else if (nextProps.genreId !== this.props.genreId) {
    //    update = true;
    //} else if (nextProps.page !== this.props.page) {
    //    update = true;
    //}else if (nextProps.path !== this.props.path) {
    //    update = true;
    //}

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
                <AdsFlexible size="728x90" itemSize={728} width />
              </div>
            )}

          <div className="row artist-list-container">
            <div className=" artist-list">
              {!this.state.isLoading &&
                this.state.results.map(item => (
                  <ArtistItem key={item.id} item={item} />
                ))}

              {this.state.isLoading && <Loading />}
              {!this.state.isLoading &&
                this.state.results.length === 0 && (
                  <Empty message="No se encontraron artistas" />
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
