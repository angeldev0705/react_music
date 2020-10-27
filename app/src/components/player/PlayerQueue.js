import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../base/Component';
import { ObjectUtil, Util } from '../../util/Util';
import { SongQueueItem } from '../song/SongQueueItem';
import { SongQueueMobileItem } from '../song/SongQueueMobileItem';
import { Icon } from '../misc/Icon';
import $ from 'jquery';
import 'string_score';

export class PlayerQueue extends Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  lastIndex = 0;
  listener = null;

  state = {
    query: ''
  };

  componentDidUpdate() {
    let currentIndex = this.props.currentIndex || 0;
    if (currentIndex === this.lastIndex) {
      return;
    }

    let current = ReactDOM.findDOMNode(this.refs[`item${currentIndex}`]);
    if (!current) {
      console.log('nada para scrollear');
      return;
    }

    let container = $(ReactDOM.findDOMNode(this.refs.list)),
      scrollTo = $(current);

    let diff = Math.abs(Math.abs(this.lastIndex) - Math.abs(currentIndex));

    if (diff > 20) {
      container.scrollTop(
        scrollTo.offset().top - container.offset().top + container.scrollTop()
      );
    } else {
      container.animate(
        {
          scrollTop:
            scrollTo.offset().top -
            container.offset().top +
            container.scrollTop()
        },
        500 + diff * 100
      );
    }

    this.lastIndex = currentIndex;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let update = false;

    if (nextProps.status !== this.props.status) {
      update = true;
    } else if (nextProps.currentIndex !== this.props.currentIndex) {
      update = true;
    } else if (nextContext.isMobile !== this.context.isMobile) {
      update = true;
    } else if (nextState.query !== this.state.query) {
      update = true;
    } else if (nextProps.queue !== this.props.queue) {
      update = true;
    }
    return update;
  }

  filter(event) {
    ReactDOM.findDOMNode(this.refs.list).scrollTop = 0;

    if (this.listener) {
      clearTimeout(this.listener);
    }

    let query = event.target.value;

    this.listener = setTimeout(() => {
      this.setState({ query: query });
    }, 10);
  }

  getQueue() {
    let items = ObjectUtil.clone(this.props.queue) || [];
    let query = this.state.query ? this.state.query.toLocaleLowerCase() : '';

    if (query) {
      return items
        .map((item, index) => {
          item.index = index;
          item.similar =
            this.similarTo(item.name, query) +
            this.similarTo(Util.getArtists(item), query);
          return item;
        })
        .filter(item => {
          return item.similar > 0.1;
        })
        .sort((from, to) => {
          return to.similar - from.similar;
        });
    } else {
      return items.map((item, index) => {
        item.index = index;
        return item;
      });
    }
  }

  similarTo(from, to) {
    return from.score(to, 0.5);
  }

  render() {
    let queue = this.getQueue();
    let currentIndex = this.props.currentIndex || 0;

    return (
      <div className={!queue ? 'queue-list disabled' : 'queue-list'}>
        <div ref="list" className="list">
          {!this.props.isMobile &&
            queue.map((item, index) => (
              <SongQueueItem
                ref={'item' + index}
                onRemoveSong={this.props.onRemoveSong}
                onTouchTap={this.props.onClickSong}
                item={item}
                key={index}
                index={index}
                active={currentIndex === index}
              />
            ))}
          {this.props.isMobile &&
            queue.map((item, index) => (
              <SongQueueMobileItem
                ref={'item' + index}
                onTouchTap={this.props.onClickSong}
                onRemoveSong={this.props.onRemoveSong}
                item={item}
                key={index}
                index={index}
                active={currentIndex === index}
              />
            ))}
        </div>

        <ul className="options">
          <li>
            <button onTouchTap={this.props.onClearQueue}>
              <Icon name="delete" />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
