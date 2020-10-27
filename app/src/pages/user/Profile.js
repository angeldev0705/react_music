import React from 'react';
import { Component, PageComponent } from '../../base/Component';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Tab, Tabs } from 'react-bootstrap';
import { ArtistList } from '../../components/artist/ArtistList';
import { SongList } from '../../components/song/SongList';
import { PlaylistList } from '../../components/playlist/PlaylistList';
import { SEO } from '../../util/SEO';
import { Analytics } from '../../util/Analytics';
import { Icon } from '../../components/misc/Icon';
import { Toolbar } from '../../components/base/Toolbar';
import { Link } from '../../components/misc/Link';
import { Loading } from '../../components/misc/Loading';
import { Auth } from '../../middleware/Auth';
import { Config } from '../../Config';
import { ImageUtil, SEOUtil } from '../../util/Util';
import { Request } from '../../util/Request';
import PubSub from 'pubsub-js';
import DocumentMeta from 'react-document-meta';
import { AdsFlexible } from '../../components/ads/AdsFlexible';

export class MyProfile extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired,
    router: React.PropTypes.object.isRequired,
    userProfile: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    let profile = Auth.getProfile() || {};
    let query = this.context.router.location.query || {};
    //        let profile = this.context.userProfile || {};
    this.context.router.replace({
      pathname: RouteGenerator.default(`u/${profile.user}`),
      query
    });
  }

  render() {
    return <Loading />;
  }
}

export class Profile extends PageComponent {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    userProfile: React.PropTypes.object.isRequired,
    isLandingActive: React.PropTypes.bool.isRequired
  };

  state = {
    isLoading: false,
    tabKey: 1,
    profile: {}
  };
  handleSelect = key => {
    let username = this.props.params.username || 'error';

    let path = `u/${username}`;
    switch (key) {
      default:
      case 1:
        path += '';
        break;
      case 2:
        path += '/canciones-favoritas';
        break;
      case 3:
        path += '/artistas';
        break;
      case 4:
        path += '/canciones';
        break;
    }

    this.context.router.replace({ pathname: RouteGenerator.default(path) });
  };

  componentDidMount() {
    PubSub.publish('onToggleLandingActive', true);
    Analytics.pageview();
    this.chooseTab(this.props.routes);

    if (this.props.params.username) {
      this.loadData(this.props.params.username);
    }
  }

  componentWillUnmount() {
    PubSub.publish('onToggleLandingActive', false);
  }

  chooseTab(routes) {
    let lastPath =
      routes && routes[routes.length - 1] ? routes[routes.length - 1].path : '';

    let key;
    switch (lastPath) {
      default:
      case 'playlists':
        key = 1;
        break;
      case 'canciones-favoritas':
        key = 2;
        break;
      case 'artistas':
        key = 3;
        break;
      case 'canciones':
        key = 4;
        break;
    }

    this.scrollTop();
    if (key !== this.state.tabKey) {
      this.setState({ tabKey: key });
    }
  }

  loadData(slug) {
    if (!slug) {
      console.error('no hay slug');
    }

    this.setState({ isLoading: true });
    Request.get(`friend/slug/${slug}`, `friend`, {}, { secure: true })
      .then(data => {
        this.setState({ profile: data || {}, isLoading: false }, () => {
          Analytics.pageview();
        });
      })
      .catch(err => {
        this.context.router.replace({
          pathname: RouteGenerator.error(404),
          query: this.props.params
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username) {
      if (nextProps.params.username !== this.props.params.username) {
        this.loadData(nextProps.params.username);
      }
    }

    let routes = nextProps.routes;
    this.chooseTab(routes);
  }

  //    shouldComponentUpdate(nextProps, nextState, nextContext) {
  //
  //        let update = false;
  //        if (nextState.tabKey !== this.state.tabKey) {
  //            update = true;
  //        } else if (nextContext.isMobile !== this.context.isMobile) {
  //            update = true;
  //        } else if (nextContext.userProfile !== this.context.userProfile) {
  //            update = true;
  //        } else if (nextState.profile !== this.state.profile) {
  //            update = true;
  //        } else if (nextState.isLoading !== this.state.isLoading) {
  //            update = true;
  //        }
  //        return update;
  //    }

  render() {
    let seo;
    seo = SEO.simple('Mi Cuenta');
    let profile = this.state.profile || {};

    let style = {
      backgroundImage: 'url(' + ImageUtil.getUserPhotoUrl(profile) + ')'
    };

    let containerClassName = 'landing-container';
    containerClassName += this.context.isLandingActive
      ? ' app-scrollable '
      : '';

    if (!profile.id) {
      return (
        <div>
          <DocumentMeta {...seo} />
          {this.context.isMobile && (
            <div className="page-title primary shadow">
              <Icon
                name="menu"
                className="menu"
                onTouchTap={this.toggleMenu.bind(this)}
              />
              <h1>Autenticando</h1>
            </div>
          )}
          <Loading />
        </div>
      );
    }

    return (
      <div>
        <DocumentMeta {...seo} />

        {!this.context.isMobile && (
          <div className="landing-background" style={style} />
        )}

        {!this.context.isMobile && (
          <Toolbar item={profile} parent="Usuarios" type="profile" />
        )}

        <div className={containerClassName}>
          {this.context.isMobile && (
            <div className="page-title primary">
              <Icon
                name="menu"
                className="menu"
                onTouchTap={this.toggleMenu.bind(this)}
              />
              <div className="pull-right btn-group">
                <Link
                  className="btn btn-default"
                  to={RouteGenerator.default('salir')}
                >
                  <Icon name="exit_to_app" />
                  <span className="caption">Cerrar sesión</span>
                </Link>
              </div>

              <h1>{profile.firstname} </h1>
            </div>
          )}

          {!this.context.isMobile && (
            <div className="landing-header">
              <div className="profile">
                <div className="image">
                  <img
                    src={ImageUtil.getUserPhotoUrl(profile)}
                    alt={profile.firstname}
                  />
                </div>
                <div className="info">
                  <span className="type">Usuario</span>
                  <h4 className="title">
                    {profile.firstname} {profile.lastname}
                  </h4>
                  <h4>
                    <Link to={RouteGenerator.default(`u/${profile.user}`)}>
                      {profile.user}
                    </Link>
                  </h4>
                </div>
              </div>
              <div className="options">
                <ul>
                  <li className="active">
                    <Link to={RouteGenerator.default('salir')}>
                      <Icon name="exit_to_app" />
                      Cerrar sesión
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="row">
            {Config.ads.enabled &&
              !SEOUtil.isSEORequest() &&
              !this.context.isMobile && (
                <div className="col-sm-12">
                  <AdsFlexible size="728x90" itemSize={728} width />
                </div>
              )}
          </div>

          {!this.state.isLoading && (
            <Tabs
              animation={false}
              activeKey={this.state.tabKey}
              onSelect={this.handleSelect}
            >
              <Tab
                eventKey={1}
                title={
                  this.context.isMobile ? (
                    <Icon name="album" />
                  ) : (
                    'Mis Playlists'
                  )
                }
              >
                <PlaylistList
                  secure={true}
                  hideTopAds={
                    !this.context.isMobile ||
                    (this.context.isMobile && this.state.tabKey !== 1)
                  }
                  hideAds={!this.context.isMobile && this.state.tabKey !== 1}
                  path={`friend/${profile.id}/playlists`}
                />
              </Tab>
              <Tab
                eventKey={2}
                title={
                  this.context.isMobile ? (
                    <Icon name="favorite" />
                  ) : (
                    'Canciones Favoritas'
                  )
                }
              >
                <SongList
                  secure={true}
                  hideTopAds={
                    !this.context.isMobile ||
                    (this.context.isMobile && this.state.tabKey !== 2)
                  }
                  hideAds={!this.context.isMobile && this.state.tabKey !== 2}
                  path={`friend/${profile.id}/favourite_songs`}
                />
              </Tab>
              <Tab
                eventKey={3}
                title={
                  this.context.isMobile ? (
                    <Icon name="mic" />
                  ) : (
                    'Artistas que Sigo'
                  )
                }
              >
                <ArtistList
                  secure={true}
                  hideTopAds={
                    !this.context.isMobile ||
                    (this.context.isMobile && this.state.tabKey !== 3)
                  }
                  hideAds={!this.context.isMobile && this.state.tabKey !== 3}
                  path={`friend/${profile.id}/artists_follow`}
                />
              </Tab>

              <Tab
                eventKey={4}
                title={
                  this.context.isMobile ? (
                    <Icon name="queue_music" />
                  ) : (
                    'Canciones que he subido'
                  )
                }
              >
                <SongList
                  secure={true}
                  hideTopAds={
                    !this.context.isMobile ||
                    (this.context.isMobile && this.state.tabKey !== 4)
                  }
                  hideAds={!this.context.isMobile && this.state.tabKey !== 4}
                  path={`friend/${profile.id}/songs`}
                />
              </Tab>
            </Tabs>
          )}
        </div>
      </div>
    );
  }
}
