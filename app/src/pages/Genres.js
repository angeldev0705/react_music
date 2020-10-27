import React from 'react';
import { PageComponent } from '../base/Component';
import { GenreList } from '../components/genre/GenreList';
import { SEO } from '../util/SEO';
import { Icon } from '../components/misc/Icon';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';

export class Genres extends PageComponent {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;

    if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    }

    return update;
  }

  componentDidMount() {
    this.scrollTop();
    Analytics.pageview();
  }

  render() {
    return (
      <div>
        <DocumentMeta
          {...SEO.simple(
            'Generos Musicales',
            'Descarga musica de todos los generos musicales gratis. Reggaeton, Bachata, Salsa, Timba. ',
            'Musica Gratis, Reggaeton, Salsa, Generos Musicales'
          )}
        />
        <div className="page-title primary shadow">
          <Icon
            name="menu"
            className="menu"
            onTouchTap={this.toggleMenu.bind(this)}
          />
          <h1>Generos</h1>
        </div>
        <GenreList />
      </div>
    );
  }
}
