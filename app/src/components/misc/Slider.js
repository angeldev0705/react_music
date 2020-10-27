import React from 'react';
import ReactDOM from 'react-dom';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
  if (pos < min) {
    return min;
  }
  if (pos > max) {
    return max;
  }
  return pos;
}

const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x'
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y'
    }
  }
};

export class Slider extends React.Component {
  static propTypes = {
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    value: React.PropTypes.number,
    secondaryValue: React.PropTypes.number,
    isLoading: React.PropTypes.bool,
    orientation: React.PropTypes.string,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string
  };

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    orientation: 'horizontal'
  };

  state = {
    limit: 0,
    grab: 0,
    sliderPos: 0,
    handlePos: 0
  };
  handleSliderMouseDown = e => {
    let value,
      { onChange } = this.props;
    if (!onChange) return;

    value = this.position(e);
    onChange && onChange(value);
  };
  handleKnobMouseDown = () => {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  };
  handleDrag = e => {
    let value,
      { onChange } = this.props;
    if (!onChange) return;

    value = this.position(e);
    onChange && onChange(value);
  };
  handleDragEnd = () => {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  };
  handleNoop = e => {
    e.stopPropagation();
    e.preventDefault();
  };
  getPositionFromValue = value => {
    let percentage, pos;
    let { limit } = this.state;
    let { min, max } = this.props;
    percentage = (value - min) / (max - min);
    pos = Math.round(percentage * limit);

    return pos;
  };
  getValueFromPosition = pos => {
    let percentage, value;
    let { limit } = this.state;
    let { orientation, min, max, step } = this.props;
    percentage = maxmin(pos, 0, limit) / (limit || 1);

    if (orientation === 'horizontal') {
      value = step * Math.round(percentage * (max - min) / step) + min;
    } else {
      value = max - (step * Math.round(percentage * (max - min) / step) + min);
    }

    return value;
  };
  position = e => {
    let pos,
      value,
      { grab } = this.state;
    let { orientation } = this.props;
    const node = ReactDOM.findDOMNode(this.refs.slider);
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = constants.orientation[orientation].direction;
    const coordinate = e['client' + capitalize(coordinateStyle)];
    const direction = node.getBoundingClientRect()[directionStyle];

    pos = coordinate - direction - grab;
    value = this.getValueFromPosition(pos);

    return value;
  };
  coordinates = pos => {
    let value, fillPos, handlePos;
    let { limit, grab } = this.state;
    let { orientation } = this.props;

    value = this.getValueFromPosition(pos);
    handlePos = this.getPositionFromValue(value);

    if (orientation === 'horizontal') {
      fillPos = handlePos + grab;
    } else {
      fillPos = limit - handlePos + grab;
    }

    return {
      fill: fillPos,
      handle: handlePos
    };
  };

  // Add window resize event listener here
  componentDidMount() {
    this.handleResizeBinded = this.handleResize.bind(this);
    this.handleResize();
    window.addEventListener('resize', this.handleResizeBinded);
  }

  handleResize() {
    if (this.listener) {
      clearTimeout(this.listener);
    }

    this.listener = setTimeout(() => {
      let { orientation } = this.props;
      let dimension = capitalize(constants.orientation[orientation].dimension);

      let slider = ReactDOM.findDOMNode(this.refs.slider);
      let handle = ReactDOM.findDOMNode(this.refs.handle);
      if (slider && handle) {
        const sliderPos = slider['offset' + dimension] || 0;
        const handlePos = handle['offset' + dimension] || 0;
        this.setState({
          limit: sliderPos - handlePos,
          grab: handlePos / 2
        });
      }
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBinded);
  }

  render() {
    let { value, secondaryValue, orientation, className } = this.props;

    let dimension = constants.orientation[orientation].dimension;
    let direction = constants.orientation[orientation].direction;

    let position = this.getPositionFromValue(value);
    let coords = this.coordinates(position);
    let secondaryFillStyle = {};
    if (secondaryValue) {
      let secondaryPosition = this.getPositionFromValue(secondaryValue);
      let secondaryCoords = this.coordinates(secondaryPosition);
      secondaryFillStyle = { [dimension]: `${secondaryCoords.fill}px` };
    }

    let fillStyle = { [dimension]: `${coords.fill}px` };
    let handleStyle = { [direction]: `${coords.handle}px` };

    return (
      <div
        ref="slider"
        className={'progress ' + ' progress-' + orientation + ' ' + className}
        onMouseDown={this.handleSliderMouseDown}
        onClick={this.handleNoop}
      >
        {this.props.isLoading && (
          <div className="progress-bar progress-bar-striped active seeking" />
        )}

        {secondaryValue > 0 && (
          <div className="progress-bar loaded" style={secondaryFillStyle} />
        )}
        <div ref="fill" className="progress-bar current" style={fillStyle} />

        <div
          ref="handle"
          className="progress-bar-handle"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={handleStyle}
        />
      </div>
    );
  }
}
