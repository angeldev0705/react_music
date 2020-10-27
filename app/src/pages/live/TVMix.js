import React from 'react';
import { PageComponent } from '../../base/Component';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Icon } from '../../components/misc/Icon';
import { Analytics } from '../../util/Analytics';
import { Storage } from '../../util/Storage';
import { SEO } from '../../util/SEO';
import { Config } from '../../Config';
import DocumentMeta from 'react-document-meta';
import {
  FacebookCommentsPlugin,
  GooglePlusButton,
  ShareButton,
  TwitterButton
} from '../../components/social/SocialWidgets';
import PubSub from 'pubsub-js';

export class TVMix extends PageComponent {
  static cookieName = 'isSharedTVMix2';
  handleEdgeCreateBinded = null;
  handleEdgeRemoveBinded = null;
  state = {
    isShared: false
  };

  onShare() {
    FB.ui(
      {
        method: 'feed',
        name: 'TvMix en vivo !!',
        link: RouteGenerator.liveTVMix(true),
        picture: `${RouteGenerator.default(
          '',
          true
        )}images/tvmix-fb.png?${Math.random()}`,
        caption: Config.app.name,
        description:
          "Disfruta de las mejores mezclas en vivo , con los mejores Dj's de Perú"
      },
      response => {
        if (response && response.post_id) {
          this.setState({
            isShared: true
          });
          Storage.set(TVMix.cookieName, 'yes');
        } else {
          this.setState({
            isShared: false
          });
        }
      }
    );

    setTimeout(() => {
      this.setState({
        isShared: true
      });
    }, 10000);
  }

  componentDidMount() {
    this.scrollTop();
    Analytics.pageview();

    Storage.get(TVMix.cookieName).then(data => {
      if (data) {
        this.setState({
          isShared: true
        });
      }
    });
  }

  componentWillMount() {
    PubSub.publish('onToggleLandingActive', true);
  }

  componentWillUnmount() {
    PubSub.publish('onToggleLandingActive', false);
  }

  render() {
    let shareText = `TvMix en vivo !!`;
    let headerClass = 'page-title  primary';
    let url = RouteGenerator.liveTVMix(true);

    return (
      <div id="live-tvmix">
        <DocumentMeta {...SEO.liveTVMix()} />

        <div className={headerClass}>
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />

          {this.context.isMobile && <h1>TvMix en vivo !!</h1>}
          {!this.context.isMobile && <h1 />}
        </div>

        <div className="live-container">
          {!this.state.isShared && (
            <div className="live-content center-container">
              <div className="logo-live" />

              <div className="animated bounceInUp share-per-view">
                <h4>
                  <strong>
                    Horario: 1 de septiembre a las 9:00pm, Lima - Perú GMT-5
                  </strong>
                </h4>
                <h4>Comparte para ver el programa en vivo</h4>
                <div className="share-button" onClick={this.onShare.bind(this)}>
                  Compartir en Facebook
                </div>
              </div>
            </div>
          )}

          {this.state.isShared && (
            <div className="live-content">
              <div className="logo-live" />

              <div className="video-container">
                <iframe
                  className="animated bounceIn"
                  width="480"
                  height="270"
                  src="https://www.ustream.tv/embed/22692381?html5ui"
                  scrolling={false}
                  allowFullScreen={true}
                  frameBorder={0}
                />
              </div>

              <div className="social-buttons">
                <ShareButton
                  href={url}
                  showFaces="false"
                  action="recommend"
                  showShare="false"
                  layout="box_count"
                />
                <TwitterButton
                  href={url}
                  text={shareText}
                  count="vertical"
                  hashtags="tvmix,envivo,musica,descargar,gratis"
                />
                <GooglePlusButton href={url} size="tall" />
              </div>

              <div className="comments-block">
                <FacebookCommentsPlugin href={url} orderBy={'reverse_time'} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
