import React from 'react';
import { ListComponent } from '../base/ListComponent';
import { GenreItem } from './GenreItem';
import { Loading } from '../misc/Loading';
import { Ads } from '../ads/Ads';
import { Empty } from '../misc/Empty';
import { Config } from '../../Config';
import { SEOUtil } from '../../util/Util';
import { AdsFlexible } from '../ads/AdsFlexible';

export class GenreList extends ListComponent {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  loadData() {
    let path = `genre`;
    let id = 'genres';
    this.loadDataFromPath(path, id);
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
                <AdsFlexible size="728x90" itemSize={728} width />
              </div>
            )}

          <div className="row genre-list-container">
            <div className=" genre-list">
              {this.state.results.map(item => (
                <div
                  className="col-xs-6 col-sm-3 col-lg-2 col-xl-2"
                  key={item.id}
                >
                  <GenreItem item={item} />
                </div>
              ))}

              {this.state.isLoading && <Loading />}
              {!this.state.isLoading &&
                this.state.results.length === 0 && (
                  <Empty message="No se encontraron generos" />
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
