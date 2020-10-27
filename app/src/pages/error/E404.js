import React from 'react';
import { PageComponent } from '../../base/Component';
import { Alert } from '../../components/misc/Alert';
import { SEO } from '../../util/SEO';
import { Icon } from '../../components/misc/Icon';
import { RouteGenerator } from '../../util/RouteGenerator';
import DocumentMeta from 'react-document-meta';

export class E404 extends PageComponent {
  search(event) {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    let query = event.target.value;
    this.listener = setTimeout(() => {
      this.context.router.push({ pathname: RouteGenerator.search(query) });
    }, 300);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    return update;
  }

  render() {
    return (
      <div>
        <DocumentMeta {...SEO.default()} />

        <div className="landing">
          <div className="landing-container">
            <div className="page-title primary shadow">
              <Icon
                name="menu"
                className="menu"
                onTouchTap={this.toggleMenu.bind(this)}
              />
              <h1>Página no encontrada</h1>
            </div>
            <div className="search-container">
              <Alert
                type="warning"
                message="El enlace ya no esta disponible, no te desanimes, escucha una canción"
              />

              <input
                type="text"
                ref="query"
                onChange={this.search.bind(this)}
                className="form-control active input-lg search-control"
                placeholder="Busca una canción o artista"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
