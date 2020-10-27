import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List } from './List';

export class FlexibleGrid extends Component {
  state = {
    itemWidth: 0
  };

  calculateItemWith() {
    let body = document.getElementsByTagName('body');
    let windowWidth =
      body && body[0] && body[0].clientWidth ? body[0].clientWidth : 0;
    let list = this.refs.list ? ReactDOM.findDOMNode(this.refs.list) : null;
    let width = list ? list.clientWidth - 1 : windowWidth;
    let itemWidth = 0;
    if (width <= windowWidth) {
      let cols = Math.floor(width / this.props.itemWidth);
      cols = cols < 1 ? 1 : cols || 1;
      itemWidth = width / cols;
    } else {
      itemWidth = width;
    }

    if (this.state.itemWidth !== itemWidth) {
      this.setState({ itemWidth }, () => {
        this.refs.list.forceUpdate();
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //
  //     let update = true;
  //     if (nextState.itemWidth === this.state.itemWidth) {
  //         update = false;
  //     }
  //
  //     return update;
  // }

  handleResize() {
    if (this.widthTimeout) {
      clearTimeout(this.widthTimeout);
    }

    this.widthTimeout = setTimeout(() => {
      this.calculateItemWith();
    }, 20);
  }

  refreshViews() {
    this.calculateItemWith();
  }

  componentDidMount() {
    this.handleResizeBinded = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResizeBinded);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBinded);
  }

  renderRow(data, index) {
    let customStyle = {};
    if (this.state.itemWidth > 0) {
      customStyle.width = this.state.itemWidth;
    }

    return (
      <div className="flexible-grid-item" style={customStyle} key={index}>
        {this.props.renderRow(data, index, customStyle)}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.itemWidth !== prevState.itemWidth) {
      if (typeof this.props.onUpdateWidth === 'function') {
        this.props.onUpdateWidth(this.state.itemWidth);
      }
    }
  }

  render() {
    let props = { ...this.props };
    delete props.renderRow;

    return <List {...props} ref="list" renderRow={this.renderRow.bind(this)} />;
  }
}
