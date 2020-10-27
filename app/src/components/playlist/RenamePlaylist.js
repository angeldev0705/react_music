import React from 'react';
import { Component } from '../../base/Component';
import { Request } from '../../util/Request';
import { Icon } from '../misc/Icon';
import { Loading } from '../misc/Loading';
import { Form, Input } from '../misc/Form';

export class RenamePlaylist extends Component {
  static contextTypes = {
    notificationCenter: React.PropTypes.any.isRequired,
    playlist: React.PropTypes.object.isRequired
  };

  state = {
    isLoading: false
  };

  handleSubmit(e) {
    e.preventDefault();

    let playlist = this.context.playlist;
    let name = this.refs.name.getValue();

    this.setState({ isLoading: true });

    Request.put(`playlist/${playlist.id}`, { name: name }, null, {
      secure: true
    })
      .then(data => {
        let playlist = data || {};
        if (typeof this.props.onSuccess === 'function') {
          this.props.onSuccess(playlist);
        }
      })
      .catch(err => {
        this.getNotificationCenter().addNotification({
          message: err.message || 'Error desconocido',
          level: 'warning',
          position: 'bc',
          autoDismiss: 2
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    let playlist = this.context.playlist || {};
    console.log(playlist);
    let name = playlist.name || '';
    let button = !this.state.isLoading ? (
      <button type="submit" className="btn btn-md btn-default">
        <Icon name="save" />
      </button>
    ) : (
      <button type="button" disabled={true} className="btn btn-md btn-default">
        <Loading type="mini" />
      </button>
    );

    return (
      <div className="update-playlist-form col-sm-12">
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Input
            autoFocus={true}
            className="active"
            defaultValue={name}
            type="text"
            ref="name"
            button={button}
            placeholder="Renombrar playlist"
            size="md"
          />
        </Form>
      </div>
    );
  }
}
