import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../base/Component';
import { SocialPlugins } from '../../util/SocialPlugins';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Config } from '../../Config';

export class FacebookPagePlugin extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.facebook(widget);
  }

  render() {
    let adaptContainerWidth = this.props.adaptContainerWidth || 'true';
    let showFacepile = this.props.showFacepile || 'true';
    let hideCover = this.props.hideCover || 'true';
    let smallHeader = this.props.smallHeader || 'true';
    let showPosts = this.props.showPosts || 'false';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="facebook-page facebook">
        <div
          className="fb-page"
          data-href={href}
          data-small-header={smallHeader}
          data-adapt-container-width={adaptContainerWidth}
          data-hide-cover={hideCover}
          data-show-facepile={showFacepile}
          data-show-posts={showPosts}
        />
      </div>
    );
  }
}

export class FacebookCommentsPlugin extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.facebook(widget);
  }

  render() {
    let orderBy = this.props.orderBy || 'social';
    let width = this.props.width || '100%';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="facebook-comments facebook">
        <div
          className="fb-comments"
          data-href={href}
          data-width={width}
          data-order-by={orderBy}
        />
      </div>
    );
  }
}

export class LikeButton extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.facebook(widget);
  }

  render() {
    let layout = this.props.layout || 'button_count';
    let action = this.props.action || 'like';
    let showFaces = this.props.showFaces || 'true';
    let share = this.props.showShare || 'false';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="social-button facebook">
        <div
          data-href={href}
          className="fb-like"
          data-layout={layout}
          data-action={action}
          data-show-faces={showFaces}
          data-share={share}
        />
      </div>
    );
  }
}

export class ShareButton extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.facebook(widget);
  }

  render() {
    let layout = this.props.layout || 'button_count';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="social-button facebook">
        <div
          data-href={href}
          className="fb-share-button"
          data-layout={layout}
        />
      </div>
    );
  }
}

export class SendButton extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.facebook(widget);
  }

  render() {
    let layout = this.props.layout || 'button_count';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="social-button facebook">
        <div data-href={href} className="fb-send" data-layout={layout} />
      </div>
    );
  }
}

export class TwitterButton extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.twitter(widget);
  }

  render() {
    let via = this.props.via || Config.app.name;
    let hashtags = this.props.hashtags || Config.app.name;
    let href = this.props.href || RouteGenerator.homepage(true);
    let text = this.props.text || '';
    let count = this.props.count || 'horizontal';

    return (
      <div className="social-button twitter">
        <a
          href={href}
          data-url={href}
          data-text={text}
          className="twitter-share-button"
          data-count={count}
          data-hashtags={hashtags}
          data-via={via}
        >
          Tweet
        </a>
      </div>
    );
  }
}

export class GooglePlusButton extends Component {
  static contextTypes = {};

  componentWillUnmount() {}

  componentDidMount() {
    let widget = ReactDOM.findDOMNode(this);
    SocialPlugins.parse.google(widget);
  }

  render() {
    let annotation = this.props.annotation || 'bubble';
    let size = this.props.size || 'medium';
    let href = this.props.href || RouteGenerator.homepage(true);

    return (
      <div className="social-button google">
        <div
          data-href={href}
          className="g-plusone"
          data-annotation={annotation}
          data-size={size}
        />
      </div>
    );
  }
}
