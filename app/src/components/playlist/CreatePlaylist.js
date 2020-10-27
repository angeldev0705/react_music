import React from 'react';
import { Component } from '../../base/Component';
import { Request } from '../../util/Request';
import { Analytics } from '../../util/Analytics';
import { Icon } from '../misc/Icon';
import { Loading } from '../misc/Loading';
import { Form, Input } from '../misc/Form';

export class CreatePlaylist extends Component {
  static contextTypes = {
    notificationCenter: React.PropTypes.any.isRequired
  };

  state = {
    isLoading: false
  };

  handleSubmit(e) {
    e.preventDefault();

    let name = this.refs.name.getValue();

    this.setState({ isLoading: true });

    Request.post(`playlist`, { name: name }, null, { secure: true })
      .then(data => {
        let playlist = data || {};
        if (typeof this.props.onCreate === 'function') {
          this.props.onCreate(playlist);
        }

        Analytics.event('playlist-create', name);

        this.refs.name.setValue('');
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
    let button = !this.state.isLoading ? (
      <button type="submit" className="btn btn-md btn-default">
        <Icon name="add" />
      </button>
    ) : (
      <button type="button" disabled={true} className="btn btn-md btn-default">
        <Loading type="mini" />
      </button>
    );

    return (
      <div className="create-playlist-form col-sm-12">
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Input
            className="active"
            type="text"
            ref="name"
            button={button}
            placeholder="crear playlist"
            size="md"
          />
        </Form>
      </div>
    );
  }
}
