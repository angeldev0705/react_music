import { Config } from '../Config';
import { ImageUtil, ObjectUtil, Util } from './Util';
import { RouteGenerator } from './RouteGenerator';
import { Request } from './Request';

export class SEO {
  static baseMeta = {
    title: `Descargar musica mp3 Gratis | ${Config.app.name}`,
    description: `En ${
      Config.app.name
    } puedes escuchar y descargar toda la musica Mp3 online gratis ${
      Config.app.name
    }.`,
    image: `${RouteGenerator.default('', true)}images/icon.png`,
    type: `website`,
    meta: {
      property: {
        'fb:app_id': Config.facebook.appId,
        'al:ios:url': '',
        'al:ios:app_name': Config.app.name,
        'al:android:url': '',
        'al:android:app_name': Config.app.name,
        'al:android:package': 'com.setbeat.music',
        'al:web:url': ''
      },
      name: {
        keywords: `musica,descargar,online,gratis,escuchar,canciones,music,letras,lyrics,online`
      }
    }
  };

  static liveTheKingdom() {
    let meta = ObjectUtil.clone(this.baseMeta);

    meta.description = `Mira el concierto de Daddy Yankee y Don Omar en vivo Gratis!! en Setbeat.com`;
    meta.image = `${RouteGenerator.default('', true)}images/dyvsdo-fb.png`;
    meta.title = `DYvsDO "The Kingdom" Concierto En vivo Gratis`;
    meta.meta.name.keywords = `DYvsDO,The Kingdom,letra,escuchar,musica,online,en linea`;

    return this.fix(meta);
  }

  static liveTVMix() {
    let meta = ObjectUtil.clone(this.baseMeta);

    meta.description = `Disfruta de las mejores mezclas en vivo , con los mejores Dj's de Perú`;
    meta.image = `${RouteGenerator.default('', true)}images/tvmix-fb.png`;
    meta.title = `TvMix en vivo !!`;
    meta.meta.name.keywords = `TVMix,Dj Freak,letra,escuchar,musica,online,en linea`;

    return this.fix(meta);
  }

  static song(song) {
    if (!song || !song.id) {
      return this.default();
    }
    let artist = Util.getArtist(song);
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.description = `Descargar ${song.name} en mp3 y todas la musica de ${
      artist.name
    }.musica gratis de ${artist.name}`;
    meta.image = ImageUtil.getImageUrl(song);
    meta.title = `Descargar ${song.name} de ${Util.getArtists(
      song
    )} | musica MP3 gratis`;
    meta.meta.name.keywords = `descargar ${song.name},${Util.getArtists(
      song
    )},letra,escuchar,musica,online,en linea`;
    meta.meta.property['og:title'] = `${Util.getArtists(song)} - ${song.name}`;
    meta.meta.property['og:description'] = `Descarga ${
      song.name
    } de ${Util.getArtists(song)} y mas canciones gratis en Setbeat.com`;

    //        let songURL = Request.getFullPath(`widget/song/${artist.slug}/${song.slug}.xml`);
    let songURL = Request.getFullPath(`widget/song/${song.id}.xml`);
    let baseURL = RouteGenerator.default('', true);

    meta.meta.property['og:video'] = `${baseURL}swf/widget.swf?list=${songURL}`;
    meta.meta.property['og:video:type'] = `application/x-shockwave-flash`;
    meta.meta.property['og:video:width'] = `500`;
    meta.meta.property['og:video:height'] = `80`;

    return this.fix(meta);
  }

  static artist(artist) {
    if (!artist || !artist.id) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.description = `Descargar musica de ${
      artist.name
    } gratis, todas la musica de ${
      artist.name
    } y más canciones de ${Util.getGenres(artist)} online gratis`;
    meta.image = ImageUtil.getImageUrl(artist);
    meta.title = `Descargar musica de ${artist.name} | musica ${Util.getGenres(
      artist
    )} gratis`;
    meta.meta.property['og:title'] = `${artist.name}`;
    meta.meta.property['og:description'] = `Descarga canciones de ${
      artist.name
    } gratis en Setbeat.com`;

    return this.fix(meta);
  }

  static playlist(playlist) {
    if (!playlist || !playlist.id) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.description = `Descargar musica de ${
      playlist.name
    } gratis, todas la musica de ${
      playlist.name
    } y más canciones online gratis`;
    //meta.image = ImageUtil.getImageUrl(playlist);
    meta.title = `Descargar musica de ${playlist.name} | musica  gratis`;
    meta.meta.property['og:title'] = `${playlist.name}`;

    return this.fix(meta);
  }

  static genre(genre, type) {
    if (!genre || !genre.id) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.description = `Disfruta de musica  ${
      genre.name
    } online gratis, escuchar ${genre.name} gratis , lo mejor de la musica ${
      genre.name
    } online`;
    meta.meta.name.keywords = `${
      genre.name
    },descargar, musica, canciones, canción, feat, orquesta, escuchar musica`;

    if (type === 'songs') {
      meta.title = `Descargar musica ${genre.name} gratis en MP3`;
      meta.meta.property['og:title'] = `Descargar ${genre.name} gratis`;
    } else if (type === 'artists') {
      meta.title = `Descargar musica ${genre.name} gratis en MP3`;
      meta.meta.property['og:title'] = `Descargar ${genre.name} gratis`;
    }

    return this.fix(meta);
  }

  static category(category, type) {
    if (!category || !category.id) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.title = `Escucha ${category.name} gratis en MP3`;
    meta.description = `Disfruta de musica  ${
      category.name
    } online gratis, escuchar ${category.name} gratis , lo mejor de la musica ${
      category.name
    } online`;
    meta.meta.name.keywords = `${
      category.name
    },descargar, musica, canciones, canción, feat, orquesta, escuchar musica`;

    return this.fix(meta);
  }

  static categoryPlaylist(playlist, type) {
    if (!playlist || !playlist.id) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.title = `Descargar musica ${playlist.name} gratis en MP3`;
    meta.description = `Disfruta de musica  ${
      playlist.name
    } online gratis, escuchar ${playlist.name} gratis , lo mejor de la musica ${
      playlist.name
    } online`;
    meta.meta.name.keywords = `${
      playlist.name
    },descargar, musica, canciones, canción, feat, orquesta, escuchar musica`;

    return this.fix(meta);
  }

  static search(query, type) {
    if (!query) {
      return this.default();
    }
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.description = `Descargar ${query} gratis, todas la musica de ${query} y más canciones de ${query} online gratis`;
    meta.meta.name.keywords = `${query}, musica, canciones, canción, feat, orquesta, escuchar musica`;

    if (type === 'songs') {
      meta.title = `${query} - Resultados de la búsqueda en ${
        Config.app.name
      } - Descargar musica gratis`;
      meta.meta.property['og:title'] = `${query} - Canciones en ${
        Config.app.name
      }`;
    } else if (type === 'artists') {
      meta.title = `${query} - Artistas en ${
        Config.app.name
      } - musica Online, Escuchar Canciones con letra Gratis`;
      meta.meta.property['og:title'] = `${query} - Artistas en ${
        Config.app.name
      }`;
    }

    return this.fix(meta);
  }

  static simple(title, description = '', keywords = '', image = '') {
    let meta = ObjectUtil.clone(this.baseMeta);
    if (title) {
      meta.title = title;
    }
    if (description) {
      meta.description = description;
    }
    if (image) {
      meta.image = image;
    }
    if (keywords) {
      meta.meta.name.keywords = keywords;
    }

    return this.fix(meta);
  }

  static default() {
    let meta = ObjectUtil.clone(this.baseMeta);
    meta.meta.property['og:title'] = `${Config.app.name} - Musica Gratis`;
    meta.meta.property['og:description'] = `En ${
      Config.app.name
    } puedes escuchar y descargar millones de canciones gratis.`;
    return this.fix(meta);
  }

  static fix(meta) {
    let tmp = ObjectUtil.clone(meta);
    if (tmp.image && !tmp.meta.property['og:image']) {
      let image = tmp.image;
      tmp.meta.property['og:image'] = image + '?' + Math.random();
      tmp.meta.property['og:image:width'] = '300';
      tmp.meta.property['og:image:height'] = '300';

      delete tmp.image;
    }
    if (tmp.type && !tmp.meta.property['og:type']) {
      let type = tmp.type;
      tmp.meta.property['og:type'] = type;
      delete tmp.type;
    }
    if (tmp.description && !tmp.meta.property['og:description']) {
      let description = tmp.description;
      tmp.meta.property['og:description'] = description;
    }
    if (tmp.title && !tmp.meta.property['og:title']) {
      let title = tmp.title;
      tmp.meta.property['og:title'] = title;
    }

    let appUrl = 'setbeat://app' + window.location.pathname;

    if (!tmp.meta.property['og:url']) {
      tmp.meta.property['og:url'] = window.location.href;
    }
    if (!tmp.meta.property['al:ios:url']) {
      tmp.meta.property['al:ios:url'] = appUrl;
    }
    if (!tmp.meta.property['al:android:url']) {
      tmp.meta.property['al:android:url'] = appUrl;
    }
    if (!tmp.meta.property['al:web:url']) {
      tmp.meta.property['al:web:url'] = window.location.href;
    }

    // try {
    //     if (
    //         !this.wasRedirected &&
    //         (isMobile.apple.device || isMobile.android.device)
    //     ) {
    //         if (this.timeout) {
    //             clearTimeout(this.timeout);
    //         }
    //
    //         if (appUrl.indexOf('tvmix') === -1) {
    //             this.timeout = setTimeout(() => {
    //                 window.location = appUrl;
    //                 this.wasRedirected = true;
    //             }, 1000);
    //         }
    //     }
    // } catch (e) {
    //     console.warn(e);
    // }

    return tmp;
  }
}
