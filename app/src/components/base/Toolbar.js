import React from 'react';
import { Component } from '../../base/Component';
import { RouteGenerator } from '../../util/RouteGenerator';
import { Link } from '../misc/Link';

export class Toolbar extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  listener = null;

  search(event) {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    let query = event.target.value;

    this.listener = setTimeout(() => {
      if (query && query.length > 0) {
        this.context.router.push({ pathname: RouteGenerator.search(query) });
      }
    }, 300);
  }

  render() {
    let item = this.props.item || {};
    let type = this.props.type || '';
    let path = this.props.path || '';
    let url = '';
    let name = '';
    let parent = this.props.parent || '';

    return (
      <div className="toolbar">
        {item.id &&
          type === 'artist' && (
            <ul className="breadcrumb">
              <li className="parent">
                <span>Música</span>
              </li>
              <li className="split">
                <span>/</span>
              </li>
              {item.generes &&
                item.generes[0] && (
                  <li>
                    <Link to={RouteGenerator.genre(item.generes[0])}>
                      {item.generes[0].name}
                    </Link>
                  </li>
                )}
              {item.generes &&
                item.generes[0] && (
                  <li className="split">
                    <span>/</span>
                  </li>
                )}
              <li className="active">
                <Link to={RouteGenerator.artist(item)}>{item.name}</Link>
              </li>
            </ul>
          )}
        {item.id &&
          type === 'playlist' && (
            <ul className="breadcrumb">
              <li className="parent">
                <span>Playlists</span>
              </li>
              <li className="split">
                <span>/</span>
              </li>
              <li>
                <Link to={RouteGenerator.default(`u/${item.user.user}`)}>
                  {item.user.user}
                </Link>
              </li>
              <li className="split">
                <span>/</span>
              </li>
              <li className="active">
                <Link to={RouteGenerator.default(`playlist/${item.id}`)}>
                  {item.name}
                </Link>
              </li>
            </ul>
          )}
        {item.id &&
          type === 'profile' && (
            <ul className="breadcrumb">
              <li className="parent">
                <span>Usuarios</span>
              </li>
              <li className="split">
                <span>/</span>
              </li>
              <li className="active">
                <Link to={RouteGenerator.default(`u/${item.user}`)}>
                  {item.user}
                </Link>
              </li>
            </ul>
          )}
        {item.id &&
          type === 'category' && (
            <ul className="breadcrumb">
              <li className="parent">
                <Link to={RouteGenerator.categories()}>Descubir</Link>
              </li>
            </ul>
          )}

        {!item.id && <ul className="breadcrumb" />}

        <div className="search-container">
          <input
            type="text"
            ref="query"
            onChange={this.search.bind(this)}
            className="form-control active input-lg search-control"
            placeholder="Buscar artista o canción"
          />
        </div>
      </div>
    );
  }
}
