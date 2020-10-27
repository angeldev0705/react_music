import { Config } from '../Config';

export function _(key, params = {}) {
  return Translator._(key, params);
}

export default class Translator {
  static locale = Translator.getSystemLocale();
  static defaultLocale = 'es';
  static translations = {
    en: require('./locales/en').default
  };

  static init() {
    this.getUserLocale().then(locale => {
      this.setLocale(locale);
    });
  }

  static setLocale(locale) {
    this.locale = locale === 'auto' ? this.getSystemLocale() : locale;
  }

  static getLocale() {
    return this.locale;
  }

  static generateTranslations(text, params = {}) {
    let locale = 'en';
    if (typeof this.tempTranslations === 'undefined') {
      this.tempTranslations = {};
    }

    if (!this.translations[locale] || !this.translations[locale][text]) {
      this.tempTranslations[text] = `'${text}':'__${text}',`;

      if (this.listener) {
        clearTimeout(this.listener);
      }

      this.listener = setTimeout(() => {
        this.output = [];
        this.output.push('[I18N] Agregar a en.js\n\n\n');
        Object.keys(this.tempTranslations).forEach(key => {
          this.output.push(this.tempTranslations[key]);
        });
        this.output.push('\n\n\n');
        console.info(this.output.join('\n'));
        this.tempTranslations = undefined;
      }, 1000);
    }
  }

  static _(text, params = {}) {
    if (Config.app.debug) {
      this.generateTranslations(text, params);
    }

    let translation = this.translations[this.locale]
      ? this.translations[this.locale][text]
      : '';
    translation = translation ? translation : text;

    let translated = translation;
    Object.keys(params).forEach(param => {
      translated = translated.replace(`{${param}}`, params[param]);
    });

    return translated;
  }

  static getUserLocale() {
    return new Promise((resolve, reject) => {
      resolve('es');
    });
  }

  static getSystemLocale() {
    //TODO implementar
    return 'es';
  }
}
