export class RouteGenerator {
  static baseUrl = document.location.origin;

  static artist(item, full) {
    return this.fix(`${item.slug}`, full);
  }

  static artistDM(item, full) {
    return this.fixDM(`${item.slug}`, full);
  }
  static playlist(item, full) {
    return this.fix(`playlist/${item.id}`, full);
  }

  static song(item, full) {
    let artist = item.artists && item.artists[0] ? item.artists[0] : {};
    if (artist.slug) {
      return this.fix(`${artist.slug}/${item.slug}`, full);
    } else {
      return this.fix(`cancion/${item.id}`, full);
    }
  }
  static songDM(item, full) {
    let artist = item.artists && item.artists[0] ? item.artists[0] : {};
    if (artist.slug) {
      return this.fixDM(`${artist.slug}/${item.slug}`, full);
    } else {
      return this.fixDM(`cancion/${item.id}`, full);
    }
  }

  static categoryPlaylist(item, full) {
    return this.fix(`escucha-ahora/${item.slug}`, full);
  }
  static categoryPlaylistDM(item, full) {
    return this.fixDM(`escucha-ahora/${item.slug}`, full);
  }

  static category(item, full) {
    return this.fix(`escucha/${item.slug}`, full);
  }
  static categoryDM(item, full) {
    return this.fixDM(`escucha/${item.slug}`, full);
  }

  static categories(full) {
    return this.fix(`descubrir`, full);
  }

  static genre(item, full) {
    return this.fix(`escuchar/${item.slug}`, full);
  }
  static genreDM(item, full) {
    return this.fixDM(`escuchar/${item.slug}`, full);
  }

  static genres(full) {
    return this.fix(`generos`, full);
  }

  static artists(full) {
    return this.fix(`artistas`, full);
  }

  static songs(full) {
    return this.fix(`canciones`, full);
  }

  static songsNearest(full) {
    return this.fix(`canciones/cercanas`, full);
  }

  static homepage(full) {
    return this.fix(``, full);
  }

  static liveTheKingdom(full) {
    return this.fix(`concierto-en-vivo-gratis`, full);
  }

  static liveTVMix(full) {
    return this.fix(`tvmix`, full);
  }

  static search(query, full) {
    if (query) {
      return this.fix(`descargar/${query}`, full);
    } else {
      return this.fix(`buscar`, full);
    }
  }

  static searchArtists(query, full) {
    if (query) {
      return this.fix(`descargar/${query}/artistas`, full);
    } else {
      return this.fix(`buscar/artistas`, full);
    }
  }

  static error(code, full) {
    return this.fix(`e${code}`, full);
  }

  static default(path, full) {
    return this.fix(`${path}`, full);
  }

  static fix(path, full) {
    return `${full ? this.baseUrl : ''}/${path}`;
  }
  static fixDM(path, full) {
    // return `https://descargarmusica.me/${path}`;
    return `${full ? this.baseUrl : ''}/${path}`;
  }
}
