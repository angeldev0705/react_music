import React from 'react';
import { SEOUtil, Util } from '../../util/Util';
import { Config } from '../../Config';

export class SEOCategory extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }

    let appName = ` ${Config.app.name} `;
    let object = this.props.category || {};
    let category = ` ${object.name} `;

    return (
      <div className="col-xs-12 seo-block">
        <h1>
          Descargar <strong>música {category} en MP3 GRATIS!</strong>
        </h1>
        {appName}
        ™ te ofrece millones de canciones y musica mp3 al alcance de tu mano.
        Los artistas que te encantan y nuevos descubrimientos. <br />
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong> , una vez instalada la
        aplicación, busca y encuentra la canción de tu agrado y agregala a tu
        lista de reproduccion. Con {appName} podras{' '}
        <strong>descargar {category}</strong> en tu telefono .
        <br />
        No dudes y descarga la aplicación gratuita para dispositivos iOS (iPhone
        , iPod y iPad).
        <br />
        <a href="https://www.youtube.com/watch?v=8xFkfkZJUmU" target="_blank">
          Ver video
        </a>
        <br />
        <br />
        <hr />
        ¿Te ha gustado Escuchar Música {category}
        &gt; Online?, Compartelo hoy mismo con tus amigos y nosotros subiremos
        más música de {category}.
        <hr />
        Música {category} 2015 » Grupos, Escuchar Música mp3
        {category} Online, Música {category} Online, Música
        {category} En Linea, Música {category} En Vivo, Música
        {category} gratis, Disfruta de las canciones de
        {category} más escuchadas en la web. Música en línea, videos, letra y
        más de
        {category}.{category}
        <br />
        <a title="Descargar música" href="https://www.setbeat.com">
          Descargar Musica
        </a>
        <br />
        <hr />
        <h2 className="oh-subtitulo">Escuchar {category}</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar {category} MP3</h2>
        <br />
        <h2 className="oh-subtitulo">Canciones {category} online</h2>
        <br />
        <h2 className="oh-subtitulo">Música {category} online</h2>
        <br />
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}

export class SEOCategoryPlaylist extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }

    let appName = ` ${Config.app.name} `;
    let object = this.props.playlist || {};
    let playlist = ` ${object.name} `;
    let hasGenres = false;
    let genre = '';

    return (
      <div className="col-xs-12 seo-block">
        <h1>Descargar música de {playlist}</h1>
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong>
        <br /> una vez instalada la aplicación, busca y encuentra la canción de
        tu agrado y agregala a tu lista de reproduccion.
        <br />
        <br />
        <strong>Super sencillo :</strong> Para{' '}
        <strong>descargar música MP3 de {playlist}</strong> en mp3 solo debes
        agregarla a tu playlist y la cancion se descargara en tu telefono !{' '}
        <br />
        Recuerda que tambien puedes seguir al artista y de esta manera te
        llegaran notificaciones de sus nuevos temas musicales para descargar su
        música gratis.
        <br />
        {appName}
        ™ te ofrece millones de canciones en MP3 para descargar gratis. Los
        artistas que te encantan y nuevos descubrimientos.
        <br />
        Comienza a descargar musica gratis con la aplicación para dispositivos
        iOS (iPhone , iPod y iPad) y Android.<br />
        <br />
        <hr />
        ¿Te ha gustado Escuchar Música {playlist} Online?, Compartelo hoy mismo
        con tus amigos y nosotros subiremos más música de {playlist}.
        <hr />
        Descargar Música de {playlist} 2015 » Canciones de
        {playlist},canciones y Música mp3
        {hasGenres ? genre : 'Nuevas'} online, Escuchar música de
        {hasGenres ? genre : 'Todos los generos'} Online, música
        {playlist} En Linea, música {playlist} En Vivo, Full música de{' '}
        {playlist} gratis, Escuchar música
        {playlist} Actual, Descargar música de {playlist}, música de {playlist}{' '}
        para Escuchar Lo Nuevo.<br />
        <br />
        <a title="Descargar música" href="https://www.setbeat.com">
          Descargar Música
        </a>
        <br />
        <hr />
        <h2 className="oh-subtitulo">Música de {playlist}&gt; online</h2>
        <br />
        {hasGenres && (
          <div>
            <h2 className="oh-subtitulo">Escuchar {genre} MP3</h2>
            <br />
            <h2 className="oh-subtitulo">Descargar {playlist}&gt; en MP3</h2>
            <br />
            <h2 className="oh-subtitulo">{playlist}&gt; en MP3</h2>
            <br />
            <h2 className="oh-subtitulo">Canciones {genre} online</h2>
            <br />
            <h2 className="oh-subtitulo">{genre} música online</h2>
            <br />
            <h2 className="oh-subtitulo">
              {playlist}&gt; canciones {genre} online
            </h2>
            <br />
          </div>
        )}
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}

export class SEOHome extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }
    let appName = ` ${Config.app.name} `;

    return (
      <div className="col-xs-12 seo-block">
        <h1>Descargar Música mp3 Gratis</h1>
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong> , una vez instalada la
        aplicación, busca y encuentra la canción de tu agrado y agregala a tu
        lista de reproduccion. Recuerda que tambien puedes seguir al artista y
        de esta manera te llegaran notificaciones de sus nuevos temas musicales.
        {appName}
        ™ te ofrece millones de canciones en MP3 al alcance de tu mano. Los
        artistas que te encantan y nuevos descubrimientos. No dudes y descarga
        la aplicación gratuita para dispositivos iOS (iPhone , iPod y iPad) y
        tambien para Android ( Disponible en Google Play Store ).<br />
        <br />
        <br />
        <a title="Descargar Musica" href="http://setbeat.com" target="_blank">
          Descargar Musica
        </a>
        <br />
        <br />
        <hr />
        ¿Te ha gustado escuchar música online? <br />
        Compartelo hoy mismo con tus amigos de facebook.
        <hr />
        {appName} respeta los derechos de autor de otros y espera que los
        usuarios de los Servicios en la Nube hagan lo mismo. Responderemos a las
        reclamaciones de supuestas infracciones de copyright que cumplan con la
        legislación y se nos proporcionen de forma adecuada. Si usted cree que
        su contenido ha sido copiado o utilizado de una forma que constituya una
        infracción de copyright, por favor, facilítenos la siguiente
        información: (i) una firma física o electrónica del propietario del
        copyright o una persona autorizada para actuar en su nombre; (ii)
        identificación de la obra cuyos derechos alega han sido violados; (iii)
        identificación del material que se indica infringe o es objeto de
        actividad infractora y que debe ser eliminado o cuyo acceso debe ser
        inhabilitado. Recuerda que {appName} es una plataforma para compartir.{' '}
        <br />
        {appName} es un servicio en la nube en el cual los usuarios pueden
        subir, compartir y <strong>descargar música gratis mp3</strong>.
        <br />
        <br />
        <strong>Descargar música mp3 gratis</strong>
        , <strong>Descargar Mp3</strong>
        , <strong>Música Mp3 descargar</strong>
        , <strong>Música para descargar</strong>
        , <strong>escuchar música</strong>
        , <strong>Música online</strong> <br />
        <hr />
        <h2 className="oh-subtitulo">Descargar música</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar música mp3</h2>
        <br />
        <h2 className="oh-subtitulo">Escuchar música</h2>
        <br />
        <h2 className="oh-subtitulo">Música online gratis</h2>
        <br />
        <h2 className="oh-subtitulo">Canciones online</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar Mp3</h2>
        <br />
        <h2 className="oh-subtitulo">Mp3 Gratis</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar música gratis</h2>
        <br />
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}

export class SEOGenre extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }

    let appName = ` ${Config.app.name} `;
    let object = this.props.genre || {};
    let genre = ` ${object.name} `;

    return (
      <div className="col-xs-12 seo-block">
        <h1>
          Descargar <strong>música {genre} en MP3 GRATIS!</strong>
        </h1>
        {appName}
        ™ te ofrece millones de canciones y musica mp3 al alcance de tu mano.
        Los artistas que te encantan y nuevos descubrimientos. <br />
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong> , una vez instalada la
        aplicación, busca y encuentra la canción de tu agrado y agregala a tu
        lista de reproduccion. Con {appName} podras{' '}
        <strong>descargar {genre}</strong> en tu telefono .
        <br />
        No dudes y descarga la aplicación gratuita para dispositivos iOS (iPhone
        , iPod y iPad).
        <br />
        <a href="https://www.youtube.com/watch?v=8xFkfkZJUmU" target="_blank">
          Ver video
        </a>
        <br />
        <br />
        <hr />
        ¿Te ha gustado Escuchar Música {genre}
        &gt; Online?, Compartelo hoy mismo con tus amigos y nosotros subiremos
        más música de {genre}.
        <hr />
        Música {genre} 2015 » Grupos, Escuchar Música mp3
        {genre} Online, Música {genre} Online, Música
        {genre} En Linea, Música {genre} En Vivo, Música
        {genre} gratis, Disfruta de las canciones de
        {genre} más escuchadas en la web. Música en línea, videos, letra y más
        de
        {genre}.{genre}
        <br />
        <a title="Descargar música" href="https://www.setbeat.com">
          Descargar Musica
        </a>
        <br />
        <hr />
        <h2 className="oh-subtitulo">Escuchar {genre}</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar {genre} MP3</h2>
        <br />
        <h2 className="oh-subtitulo">Canciones {genre} online</h2>
        <br />
        <h2 className="oh-subtitulo">Música {genre} online</h2>
        <br />
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}

export class SEOArtist extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }

    let appName = ` ${Config.app.name} `;
    let object = this.props.artist || {};
    let artist = ` ${object.name} `;
    let hasGenres = !!Util.getGenre(object).id;
    let genre = hasGenres ? ` ${Util.getGenre(object).name} ` : '';
    let genres = ` ${Util.getGenres(object)} `;

    return (
      <div className="seo-block">
        <h1>Descargar música de {artist}</h1>
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong>
        <br /> una vez instalada la aplicación, busca y encuentra la canción de
        tu agrado y agregala a tu lista de reproduccion.
        <br />
        <br />
        <strong>Super sencillo :</strong> Para{' '}
        <strong>descargar música MP3 de {artist}</strong> en mp3 solo debes
        agregarla a tu playlist y la cancion se descargara en tu telefono !{' '}
        <br />
        Recuerda que tambien puedes seguir al artista y de esta manera te
        llegaran notificaciones de sus nuevos temas musicales para descargar su
        música gratis.
        <br />
        {appName}
        ™ te ofrece millones de canciones en MP3 para descargar gratis. Los
        artistas que te encantan y nuevos descubrimientos.
        <br />
        Comienza a descargar musica gratis con la aplicación para dispositivos
        iOS (iPhone , iPod y iPad) y Android.<br />
        <br />
        <hr />
        ¿Te ha gustado Escuchar Música {artist} Online?, Compartelo hoy mismo
        con tus amigos y nosotros subiremos más música de {artist}.
        <hr />
        Descargar Música de {artist} 2015 » Canciones de
        {artist},canciones y Música mp3
        {hasGenres ? genre : 'Nuevas'} online, Escuchar música de
        {hasGenres ? genre : 'Todos los generos'} Online, música
        {artist} En Linea, música {artist} En Vivo, Full música de {artist}{' '}
        gratis, Escuchar música
        {artist} Actual, Descargar música de {artist}, música de {artist} para
        Escuchar Lo Nuevo.<br />
        <br />
        <a title="Descargar música" href="https://www.setbeat.com">
          Descargar Música
        </a>
        <br />
        <hr />
        <h2 className="oh-subtitulo">Música de {artist}&gt; online</h2>
        <br />
        {hasGenres && (
          <div>
            <h2 className="oh-subtitulo">Escuchar {genre} MP3</h2>
            <br />
            <h2 className="oh-subtitulo">Descargar {artist}&gt; en MP3</h2>
            <br />
            <h2 className="oh-subtitulo">{artist}&gt; en MP3</h2>
            <br />
            <h2 className="oh-subtitulo">Canciones {genre} online</h2>
            <br />
            <h2 className="oh-subtitulo">{genre} música online</h2>
            <br />
            <h2 className="oh-subtitulo">
              {artist}&gt; canciones {genre} online
            </h2>
            <br />
          </div>
        )}
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}

export class SEOSong extends React.Component {
  render() {
    if (!SEOUtil.isSEORequest()) {
      return null;
    }

    let appName = ` ${Config.app.name} `;
    let object = this.props.song || {};
    let song = ` ${object.name} `;
    let hasArtists = !!Util.getArtist(object).id;
    let artist = hasArtists ? ` ${Util.getArtist(object).name} ` : '';
    let artists = ` ${Util.getArtists(object)} `;

    return (
      <div className="col-xs-12 seo-block">
        <h1>
          Descargar {song} de {artists}{' '}
        </h1>
        Para{' '}
        <strong>
          descargar música mp3 gratis en tu SmartPhone (Iphone ó Android)
        </strong>{' '}
        debes instalar la aplicación ingresando desde tu telefono a{' '}
        <strong>https://app.setbeat.com</strong>
        <br /> una vez instalada la aplicación, busca y encuentra la canción de
        tu agrado y agregala a tu lista de reproduccion.
        <br />
        <br />
        <strong>Super sencillo :</strong> Para{' '}
        <strong>
          descargar {song}
          de {artists}
        </strong>{' '}
        en mp3 solo debes agregarla a tu playlist y la cancion se descargara en
        tu telefono ! <br />
        Recuerda que tambien puedes seguir al artista y de esta manera te
        llegaran notificaciones de sus nuevos temas musicales para descargar su
        música gratis.
        <br />
        {appName}
        ™ te ofrece millones de canciones en MP3 para descargar gratis. Los
        artistas que te encantan y nuevos descubrimientos.
        <br />
        Comienza a descargar musica gratis con la aplicación para dispositivos
        iOS (iPhone , iPod y iPad) y Android.<br />
        <br />
        <hr />
        ¿Te ha gustado Escuchar {song} en MP3?, Compartelo hoy mismo con tus
        amigos y nosotros subiremos más música de {artists}.
        <hr />
        {appName} respeta los derechos de autor de otros y espera que los
        usuarios de los Servicios en la Nube hagan lo mismo. Responderemos a las
        reclamaciones de supuestas infracciones de copyright que cumplan con la
        legislación y se nos proporcionen de forma adecuada. Si usted cree que
        su contenido ha sido copiado o utilizado de una forma que constituya una
        infracción de copyright, por favor, facilítenos la siguiente
        información: (i) una firma física o electrónica del propietario del
        copyright o una persona autorizada para actuar en su nombre; (ii)
        identificación de la obra cuyos derechos alega han sido violados; (iii)
        identificación del material que se indica infringe o es objeto de
        actividad infractora y que debe ser eliminado o cuyo acceso debe ser
        inhabilitado. Recuerda que {appName} es una plataforma para compartir.{' '}
        <br />
        {appName} es un servicio en la nube en el cual los usuarios pueden
        subir, compartir y <strong>descargar música gratis mp3</strong>.
        <br />
        <br />
        <strong>Descargar {song} mp3 gratis</strong>,{' '}
        <strong>Música Mp3 descargar</strong>,{' '}
        <strong>Música para descargar</strong>,{' '}
        <strong>
          escuchar música de
          {artists}
        </strong>, <strong>Música online</strong> <br />
        <hr />
        <h2 className="oh-subtitulo">Escuchar {song}</h2>
        <br />
        <h2 className="oh-subtitulo">Música de {artists}</h2>
        <br />
        <h2 className="oh-subtitulo">Descargar {song} MP3</h2>
        <br />
        <h2 className="oh-subtitulo">{song} en MP3</h2>
        <br />
        <h2 className="oh-subtitulo">
          {artists} descargar {song}
        </h2>
        <br />
        <a
          title="Descargar música para iPhone, iPod y iPad"
          href="https://ios.setbeat.com"
          target="_blank"
        >
          Descargar Música para iPhone
        </a>
        <br />
        <a
          title="Descargar música para Android"
          href="https://android.setbeat.com"
          target="_blank"
        >
          Descargar Música para Android
        </a>
      </div>
    );
  }
}
