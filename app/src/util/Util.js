import { Config } from '../Config';

export class Util {
  static getSongTitle(song) {
    if (!song) {
      return '';
    }

    return this.getArtists(song) + ' - ' + song.name;
  }

  static getSongTitleInverted(song) {
    if (!song) {
      return '';
    }

    return song.name + ' - ' + this.getArtists(song);
  }

  static getTotalSongs(artist) {
    let totalSongs = '';
    switch (artist.total_songs) {
      case 0:
        totalSongs = 'sin canciones';
        break;
      case 1:
        totalSongs = '1 canción';
        break;
      default:
        totalSongs = `${artist.total_songs} canciones`;
        break;
    }

    return totalSongs;
  }

  static getTotalArtists(genre) {
    let totalArtists = '';
    switch (genre.total_artists) {
      case 0:
        totalArtists = 'sin artistas';
        break;
      case 1:
        totalArtists = '1 artista';
        break;
      default:
        totalArtists = `${genre.total_artists} artistas`;
        break;
    }

    return totalArtists;
  }

  static getTotalPlaylists(category) {
    let total = '';
    switch (category.total_playlists) {
      case 0:
        total = 'sin playlists';
        break;
      case 1:
        total = '1 playlist';
        break;
      default:
        total = `${category.total_playlists} playlists`;
        break;
    }

    return total;
  }

  static getArtists(song, asArray) {
    if (!song || !song.id) {
      return '';
    }

    let artists = [];

    if (song.artists && Array.isArray(song.artists)) {
      song.artists.forEach(artist => {
        artists.push(artist.name);
      });
    }

    if (asArray) {
      return artists;
    }

    let firstArtist = artists.shift();

    return `${firstArtist} ${
      artists.length > 0 ? ` Ft. ${artists.join(', ')}` : ''
    }`;
  }

  static getArtist(song) {
    if (!song || !song.id) {
      return {};
    }

    return song.artists && song.artists[0] ? song.artists[0] : {};
  }

  static getGenres(artist, asArray) {
    if (!artist || !artist.id) {
      return {};
    }

    let genres = [];

    if (artist.generes && Array.isArray(artist.generes)) {
      artist.generes.forEach(genre => {
        genres.push(genre.name);
      });
    }

    if (asArray) {
      return genres;
    }

    return genres.join(', ');
  }

  static getGenre(artist) {
    if (!artist || !artist.id) {
      return {};
    }
    return artist.generes && artist.generes[0] ? artist.generes[0] : {};
  }
}

export class ImageUtil {
  static getUserPhotoUrl(song) {
    return this.getUserPhotoUrlSize(song);
  }

  static getUserPhotoMiniUrl(song) {
    return this.getUserPhotoUrlSize(song, 'mini');
  }

  static getUserPhotoUrlSize(song, size) {
    let image = '';
    let param = 'photo' + (size ? '_' + size : '');

    if (song[param]) {
      image = song[param];
    }

    if (!image) {
      image = Config.assets.imageFallback;
    }

    return image;
  }

  static getImageUrl(song) {
    return this.getImageUrlSize(song);
  }

  static getImageMiniUrl(song) {
    return this.getImageUrlSize(song, 'mini');
  }

  static getImageNormalUrl(song) {
    return this.getImageUrlSize(song, 'normal');
  }

  static getImageUrlSize(song, size) {
    let image = '';
    let param = 'image' + (size ? '_' + size : '');

    if (song[param]) {
      image = song[param];
    } else if (song.artists) {
      image =
        song.artists[0] && song.artists[0][param] ? song.artists[0][param] : '';
    }

    if (!image) {
      image = Config.assets.imageFallback;
    }

    return image;
  }
}

export class TimeUtil {
  static convertTime(seconds) {
    let myTime = new Date(seconds);
    let hour = myTime.getUTCHours();
    let min = myTime.getUTCMinutes();
    let sec = myTime.getUTCSeconds();
    let strHour = hour > 0 ? (hour < 10 ? '0' + hour : hour) + ':' : '';
    let strMin = min > 0 ? (min < 10 ? '0' + min : min) + ':' : '00:';
    let strSec = sec > 0 ? (sec < 10 ? '0' + sec : sec) : '00';
    return strHour + strMin + strSec;
  }

  static stringToTime(timeString) {
    timeString = timeString || '';
    let l = timeString.split('.');
    let t = 0;
    try {
      let j = l[0].split(':');
      t += parseInt(j[j.length - 1], 10) * 1000;
      if (j.length > 1) {
        t += parseInt(j[j.length - 2], 10) * 60000;
      }
      if (j.length > 2) {
        t += parseInt(j[j.length - 3], 10) * 3600000;
      }
      if (l.length > 1) {
        if (l[1].length === 1) {
          t += parseInt(l[1], 10) * 100;
        } else if (l[1].length === 2) {
          t += parseInt(l[1], 10) * 10;
        } else if (l[1].length === 3) {
          t += parseInt(l[1], 10);
        }
      }
      return t;
    } catch (e) {
      return 0;
    }
  }

  static getInitialTime() {
    let time = this.getQueryParameter('t');
    let regex = /(?:(?:(\d+)h)?(\d+)m)?(\d+)s/i;
    let timeParts = regex.exec(time);
    let seconds = 0;
    if (timeParts) {
      timeParts.shift();
      seconds += timeParts[0] ? parseInt(timeParts[0], 10) * 60 * 60 : 0;
      seconds += timeParts[1] ? parseInt(timeParts[1], 10) * 60 : 0;
      seconds += timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    }

    return seconds;
  }

  static getQueryParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  convertTimeHumanized(seconds) {
    let myTime = new Date(seconds);
    let hour = myTime.getUTCHours();
    let min = myTime.getUTCMinutes();
    let sec = myTime.getUTCSeconds();
    let strHour = hour > 0 ? hour + 'h' : '';
    let strMin = min > 0 ? min + 'm' : '';
    let strSec = sec > 0 ? sec + 's' : '';
    return strHour + strMin + strSec;
  }
}

export class ElementUtil {
  static isChildOf(child, parent) {
    if (child.parentNode === parent) {
      return true;
    } else if (child.parentNode === null) {
      return false;
    } else {
      return ElementUtil.isChildOf(child.parentNode, parent);
    }
  }

  static offset(element) {
    let rect = element.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  }

  static scrollTo(element, to, duration) {
    if (duration < 0) return;
    let difference = to - element.scrollTop;
    let perTick = difference / duration * 1;

    return setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      this.scrollTo(element, to, duration - 1);
    }, 1);
  }
}

export class ObjectUtil {
  static toQueryString(obj) {
    let parts = [];
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
      }
    }
    return parts.join('&');
  }

  static clone(obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = ObjectUtil.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = ObjectUtil.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error('Unable to copy obj! Its type isnt supported.');
  }
}

export class RegexUtil {
  static execAll(regex, string) {
    let match = null;
    let matches = [];
    while ((match = regex.exec(string))) {
      let matchArray = [];
      for (let i in match) {
        if (parseInt(i) == i) {
          matchArray.push(match[i]);
        }
      }
      matches.push(matchArray);
    }
    return matches;
  }
}

export class NumberUtil {
  static round(num) {
    return Math.round(num * 100.0) / 100.0;
  }

  static format(number, decimals = 0, dec_point = '.', thousands_sep = ',') {
    if (number >= 1000000) {
      return Math.round(number / 1000000) + 'M';
    } else if (number >= 10000) {
      return Math.round(number / 1000) + 'K';
    }

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
      dec = typeof dec_point === 'undefined' ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        let k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k).toFixed(prec);
      };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
}

export class SEOUtil {
  static isSEORequest() {
    //return true;
    return typeof window.callPhantom === 'function';
  }
}

export class BrowserUtil {
  static allowFullScreen() {
    if (document.exitFullscreen) {
      return true;
    } else if (document.mozCancelFullScreen) {
      return true;
    } else if (document.webkitCancelFullScreen) {
      return true;
    } else {
      return false;
    }
  }

  static enterFullScreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  static exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  //    if (document.addEventListener) {
  //    document.addEventListener("fullscreenchange", function () {
  //    if (document.fullscreen) {
  //        this._status.fullscreen = false;
  //        this.fullScreen();
  //    } else {
  //        this._status.fullscreen = true;
  //        this.fullScreen();
  //    }
  //}, false);
  //
  //    document.addEventListener("mozfullscreenchange", function () {
  //    if (document.mozFullScreen) {
  //        this._status.fullscreen = false;
  //        this.fullScreen();
  //    } else {
  //        this._status.fullscreen = true;
  //        this.fullScreen();
  //    }
  //}, false);
  //
  //    document.addEventListener("webkitfullscreenchange", function () {
  //    if (document.webkitIsFullScreen) {
  //        this._status.fullscreen = false;
  //        this.fullScreen();
  //    } else {
  //        this._status.fullscreen = true;
  //        this.fullScreen();
  //    }
  //}, false);
  //
  //}
}
