import React, { Component } from 'react';
import { Request } from '../../util/Request';
import { Loading } from '../misc/Loading';
import { Alert } from '../misc/Alert';

export class List extends Component {
  state = {
    items: [],
    isLoading: false
  };

  load(): Promise {
    this.abortCurrentRequest();

    let path = this.props.path || '';
    let params = this.props.params || {};

    this.setState({ isLoading: true });
    this.idRequest = `${path}_${JSON.stringify(params)}`;
    return Request.get(path, null, params, this.idRequest)
      .then(response => {
        let items = response.results || [];
        this.setState({ items, isLoading: false });
        return response;
      })
      .catch(() => {
        this.setState({ isLoading: false });
        return [];
      })
      .then(response => {
        if (typeof this.props.onLoadItems === 'function') {
          this.props.onLoadItems(response);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    let reload = false;
    if (this.props.path !== prevProps.path) {
      reload = true;
    } else if (this.props.params !== prevProps.params) {
      reload = true;
    }

    reload && this.load();
  }

  shouldComponentUpdate(nextProps, nextState) {
    let nextParams = nextProps.params || {};
    let params = this.props.params || {};
    let update = false;
    if (nextProps.path !== this.props.path) {
      update = true;
    } else if (nextParams.limit !== params.limit) {
      update = true;
    } else if (nextParams.query !== params.query) {
      update = true;
    } else if (nextParams.page !== params.page) {
      update = true;
    } else if (nextState.isLoading !== this.state.isLoading) {
      update = true;
    }

    return update;
  }

  componentDidMount() {
    this.load();
  }

  refreshViews() {}

  abortCurrentRequest() {
    this.idRequest && Request.abort(this.idRequest);
  }

  componentWillUnmount() {
    this.abortCurrentRequest();
  }

  renderRow(item, index, styles) {
    return this.props.renderRow(item, index, styles);
  }

  render() {
    return (
      <div>
        {this.state.isLoading && <Loading />}

        {!this.state.isLoading &&
          this.state.items.map((item, index) => {
            return this.renderRow(item, index);
          })}
        {!this.state.isLoading &&
          this.state.items.length < 1 && (
            <Alert icon="error" label={'No se encontraron resultados'} />
          )}
      </div>
    );
  }
}
