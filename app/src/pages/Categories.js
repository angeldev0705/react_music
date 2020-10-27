import React from 'react';
import { PageComponent } from '../base/Component';
import { CategoryList } from '../components/category/CategoryList';
import { SEO } from '../util/SEO';
import { Icon } from '../components/misc/Icon';
import { Analytics } from '../util/Analytics';
import DocumentMeta from 'react-document-meta';

export class Categories extends PageComponent {
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
            'Descubre toda la música',
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
          <h1>Descubrir</h1>
        </div>
        <CategoryList />
      </div>
    );
  }
}
