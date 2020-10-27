import React from 'react';
import { Component } from '../../base/Component';
import { CategoryItem } from './CategoryItem';
import { FlexibleGrid } from '../base/FlexibleGrid';
import { Ads } from '../ads/Ads';
import { Config } from '../../Config';
import { SEOUtil } from '../../util/Util';
import { AdsFlexible } from '../ads/AdsFlexible';

export class CategoryList extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  renderRow(item, index, style) {
    return <CategoryItem key={index} item={item} style={style} />;
  }

  render() {
    let props = { ...this.props };

    if (typeof this.props.renderRow === 'undefined') {
      props.renderRow = this.renderRow.bind(this);
    }

    if (typeof this.props.itemWidth === 'undefined') {
      props.itemWidth = 160;
    }

    if (typeof this.props.path === 'undefined') {
      props.path = 'category';
    }
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
          <div className="row category-list-container">
            <div className=" category-list">
              <FlexibleGrid ref="list" {...props} />
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
