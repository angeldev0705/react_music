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
  GooglePlusButton,
  ShareButton,
  TwitterButton
} from '../../components/social/SocialWidgets';

export class TheKingdom extends PageComponent {
  static cookieName = 'isSharedDYvsDO';
  handleEdgeCreateBinded = null;
  handleEdgeRemoveBinded = null;
  state = {
    isShared: false
  };

  //handleEdgeCreate(url, html_element) {
  //    console.log('page_like_or_unlike_callback');
  //    console.log(url);
  //    console.log(html_element);
  //    this.setState({
  //        isShared: true
  //    });
  //}
  //
  //handleEdgeRemove(url, html_element) {
  //    console.log('page_like_or_unlike_callback REMOVE');
  //    console.log(url);
  //    console.log(html_element);
  //    this.setState({
  //        isShared: false
  //    });
  //}

  onShare() {
    FB.ui(
      {
        method: 'feed',
        name: 'DYvsDO "The Kingdom" Concierto En vivo Gratis',
        link: RouteGenerator.liveTheKingdom(true),
        picture: `${RouteGenerator.default(
          '',
          true
        )}images/dyvsdo-fb.png?${Math.random()}`,
        caption: Config.app.name,
        description:
          'Mira el concierto de Daddy Yankee y Don Omar en vivo Gratis!! en setbeat.com'
      },
      response => {
        if (response && response.post_id) {
          this.setState({
            isShared: true
          });
          Storage.set(TheKingdom.cookieName, 'yes');
        } else {
          this.setState({
            isShared: false
          });
        }
      }
    );
  }

  componentDidMount() {
    this.scrollTop();
    Analytics.pageview();

    Storage.get(TheKingdom.cookieName).then(data => {
      if (data) {
        this.setState({
          isShared: true
        });
      }
    });

    //this.handleEdgeCreateBinded = this.handleEdgeCreate.bind(this);
    //this.handleEdgeRemoveBinded = this.handleEdgeRemove.bind(this);

    //if (typeof FB !== 'undefined') {
    //}

    //setTimeout(()=>{
    //    FB.Event.subscribe('message.send', this.handleEdgeCreateBinded);
    //    FB.Event.subscribe('edge.remove', this.handleEdgeRemoveBinded);
    //
    //},3000)
  }

  //componentWillUnmount() {
  //    //if (typeof FB !== 'undefined') {
  //        FB.Event.unsubscribe('edge.create', this.handleEdgeCreateBinded);
  //        FB.Event.unsubscribe('edge.remove', this.handleEdgeRemoveBinded);
  //    //}
  //
  //}

  render() {
    let shareText = `Ver concierto de Daddy Yankee y Don Omar en vivo`;
    let headerClass = 'page-title  primary';
    let url = RouteGenerator.liveTheKingdom(true);

    return (
      <div id="live-dyvsdo">
        <DocumentMeta {...SEO.liveTheKingdom()} />

        <div className={headerClass}>
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />

          {this.context.isMobile && (
            <h1>Concierto de Daddy Yankee y Don Omar </h1>
          )}
          {!this.context.isMobile && <h1 />}
        </div>

        {!this.state.isShared && (
          <div>
            <div className="animated pulse logo-live" />

            <div className="animated bounceInUp share-per-view">
              <div>
                <h4>
                  <strong>
                    Horario: 4, 5 y 6 de Diciembre a las 8pm, Lima - Perú GMT-5
                  </strong>
                </h4>
                <h4>Comparte para ver el Concierto en vivo</h4>
                <div className="share-button" onClick={this.onShare.bind(this)}>
                  Compartir en Facebook
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.isShared && (
          <div>
            <div className="animated pulse logo-live" />
            <iframe
              className="animated bounceIn iframe-full"
              id="su-ivp"
              src="https://streamup.com/DYvsDO/embeds/video?startMuted=false"
              scrolling="no"
              frameBorder={0}
              allowTransparency={true}
              allowFullScreen={true}
              seamless
              width="100%"
              height="100%"
            />
            <div>
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
                hashtags="musica,descargar,gratis"
              />
              <GooglePlusButton href={url} size="tall" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
