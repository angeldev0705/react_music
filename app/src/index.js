import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';
import { App } from './App';
import { Provider } from './Provider';
import { Auth } from './middleware/Auth';
import { Login } from './pages/account/Login';
import { Recovery } from './pages/account/Recovery';
import { ResetPassword } from './pages/account/ResetPassword';
import { Logout } from './pages/account/Logout';
import { MyProfile, Profile } from './pages/user/Profile';
import { E404 } from './pages/error/E404';
import { Home } from './pages/Home';
import { Genre } from './pages/Genre';
import { Install } from './pages/Install';
import { Android as InstallAndroid } from './pages/install/Android';
import { Iphone as InstallIphone } from './pages/install/Iphone';
import { Playlist } from './pages/Playlist';
import { Artist } from './pages/Artist';
import { Genres } from './pages/Genres';
import { Categories } from './pages/Categories';
import { Category } from './pages/Category';
import { CategoryPlaylist } from './pages/CategoryPlaylist';
import { Search } from './pages/Search';
import { Artists } from './pages/Artists';
import { Songs } from './pages/Songs';
import { SongsNearest } from './pages/SongsNearest';
import { AuthSpotifyCallback } from './pages/auth/SpotifyCallback';
import { Analytics } from './util/Analytics';
import { Storage } from './util/Storage';
import { SocialPlugins } from './util/SocialPlugins';
import { AudioPlayer } from './util/AudioPlayer';
import { Android } from './pages/promo/Android';
import { IphoneOLD } from './pages/promo/Iphone';

import injectTapEventPlugin from 'react-tap-event-plugin';
import '../favicon.ico';
import '../images/icon.png';
import '../images/apple-splash.png';
import '../images/apple-touch-icon.png';
import '../images/apple-touch-icon-192.png';
import '../images/dyvsdo-bg.jpg';
import '../images/dyvsdo-fb.png';
import '../images/dyvsdo-event-title.png';
import '../images/tvmix-bg.jpg';
import '../images/tvmix-fb.png';
import '../images/tvmix-event-title.png';
import './styles/Bootstrap.less';
import './styles/Theme.scss';
import './styles/Animated.css';
import '../swf/widget.swf';

injectTapEventPlugin();

Storage.init();
AudioPlayer.init();
SocialPlugins.init();
Analytics.init();

function requireAuth(nextState, replace) {
  if (!Auth.isLoggedIn()) {
    replace({
      pathname: '/acceder',
      query: { redir: nextState.location.pathname }
    });
  }
}

ReactDOM.render(
  <Provider>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />

        <Route path="install/iphone" component={InstallIphone} />
        <Route path="install/android" component={InstallAndroid} />
        <Route path="install" component={Install} />
        <Route path="android" component={Android} />
        <Route path="iphone" component={IphoneOLD} />

        <Route path="auth/spotify/callback" component={AuthSpotifyCallback} />

        <Route path="escucha/:category" component={Category} />
        <Route path="descubrir" component={Categories} />
        <Route path="escucha-ahora/:playlist" component={CategoryPlaylist} />

        <Route path="salir" component={Logout} />
        <Route path="acceder" component={Login} />
        <Route path="resetear" component={ResetPassword} />
        <Route path="recuperar" component={Recovery} />
        <Route path="cuenta" component={MyProfile} onEnter={requireAuth} />
        <Route path="u/:username" component={Profile}>
          <Route path="artistas" />
          <Route path="canciones-favoritas" />
          <Route path="canciones" />
          <Route path="playlists" />
        </Route>
        <Route path="playlist/:id" component={Playlist} />

        {/*<Route path="tvmix" component={TVMix}/>*/}
        {/*<Route path="tvmix2" component={TVMix}/>*/}
        <Route path="generos" component={Genres} />
        <Route path="e404" component={E404} />
        <Route path="buscar" component={Search}>
          <Route path="artistas" />
        </Route>
        <Route path="artistas" component={Artists}>
          <Route path="tendencia" />
          <Route path="populares" />
          <Route path="nuevos" />
        </Route>
        <Route path="canciones/cercanas" component={SongsNearest} />
        <Route path="canciones" component={Songs}>
          <Route path="populares-hoy" />
          <Route path="populares-mes" />
          <Route path="nuevas" />
        </Route>
        <Route path="descargar/:query" component={Search}>
          <Route path="artistas" />
          <Route path="canciones" />
        </Route>
        <Route path="escuchar/:genre" component={Genre}>
          <Route path="artistas" />
          <Route path="canciones" />
        </Route>
        <Route path=":artist" component={Artist}>
          <Route path=":song">
            <Route path="letra" />
          </Route>
        </Route>
        <Route path="*" component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
  function() {
    Auth.init();
  }
);
