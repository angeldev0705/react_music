import React from 'react';
import { Component } from '../../base/Component';
import { Request } from '../../util/Request';
import { Loading } from '../misc/Loading';
import { Empty } from '../misc/Empty';

export class ListComponent extends Component {
  static propTypes = { limit: React.PropTypes.number };
  static defaultProps = { limit: 70, page: 1 };

  id = '';

  state = {
    results: [],
    total: 10,
    selectedItem: 0,
    secure: false,
    isPendingLogged: false,
    isLoading: true
  };

  componentWillUnmount() {
    Request.abort(this.id);
  }

  loadData() {
    this.loadDataFromPath();
  }

  loadDataFromPath(path, id, params = {}, config = {}) {
    if (!path && this.props.path) {
      path = this.props.path;
      id = this.props.path;
    }

    this.id = id;

    this.setState({ isLoading: true });
    return Request.get(path, this.id, params, config).then(data => {
      this.setState({ results: data.results || [], isLoading: false });

      if (typeof this.props.onResultsDidLoaded === 'function') {
        this.props.onResultsDidLoaded(data.results);
      }

      return data;
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.results.map(item => <li key={item.name}>{item.id} </li>)}
        </ul>
        {this.state.isLoading && <Loading />}
        {!this.state.isLoading && this.state.results.length === 0 && <Empty />}
      </div>
    );
  }
}
