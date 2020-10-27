import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Ads } from './Ads';

export class AdsFlexible extends PureComponent {
  state = {
    size: 0
  };

  getItemSize() {
    return this.props.itemSize;
  }

  calculateSize() {
    let { width, height } = this.props;
    let list = this.refs.list ? ReactDOM.findDOMNode(this.refs.list) : null;
    let size = 0;

    if (width) {
      size = list.clientWidth;
    } else if (height) {
      size = list.clientHeight;
    }

    this.setState({ size });
  }

  handleResize() {
    if (this.widthTimeout) {
      clearTimeout(this.widthTimeout);
    }

    this.widthTimeout = setTimeout(() => {
      this.calculateSize();
    }, 20);
  }

  componentDidMount() {
    this.handleResizeBinded = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResizeBinded);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBinded);
  }

  render() {
    let { size } = this.state;
    let { itemSize, height, width, maxItems, ...props } = this.props;
    let total = Math.floor(size / itemSize);
    maxItems = maxItems || 2;
    total = total > maxItems ? maxItems : total;
    //FIXME
    total = 1;
    let ads = [];
    for (let i = 0; i < total; i++) {
      ads.push(<Ads key={i} {...props} />);
    }
    return (
      <div ref="list" className="ads-group">
        {ads.map(ad => {
          return ad;
        })}
      </div>
    );
  }
}
