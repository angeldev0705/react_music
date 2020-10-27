import React from 'react';
import { Component } from '../../base/Component';
import { Link } from '../misc/Link';
import { RouteGenerator } from '../../util/RouteGenerator';

export class ArtistsFt extends Component {
  render() {
    let artists = this.props.artists || [];

    return (
      <div className="artists-ft">
        {artists.length > 0 && (
          <Link to={RouteGenerator.artist(artists[0])}>{artists[0].name}</Link>
        )}

        {artists.length > 1 && ' Ft. '}

        {(artists => {
          let data = [];
          for (let i = 1, total = artists.length; i < total; i++) {
            let extraText = i > 1 && i < total ? ', ' : '';
            if (extraText) {
              data.push(<span key={'split_' + i}>{extraText}</span>);
            }
            let artist = artists[i];
            data.push(
              <Link key={artist.id} to={RouteGenerator.artist(artist)}>
                {artist.name}
              </Link>
            );
          }

          return data;
        })(artists)}
      </div>
    );
  }
}
