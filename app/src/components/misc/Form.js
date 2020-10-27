import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '../../base/Component';

export class Input extends Component {
  static seed = 0;
  id = '';

  componentWillMount() {
    Input.seed++;
    this.id = `input_${Input.seed}`;
  }

  getValue() {
    return ReactDOM.findDOMNode(this.refs.input).value.trim();
  }

  setValue(value) {
    return (ReactDOM.findDOMNode(this.refs.input).value = value);
  }

  getInputDOMNode() {
    return ReactDOM.findDOMNode(this.refs.input);
  }

  isValid() {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.input && prevProps.defaultValue !== this.props.defaultValue) {
      ReactDOM.findDOMNode(this.refs.input).value = this.props.defaultValue;
    }
  }

  render() {
    let id = this.id;
    let input = this.props.input || null;
    let label = this.props.label || '';
    let type = this.props.type || 'text';
    let placeholder = this.props.placeholder || '';
    let required = this.props.required || false;
    let layout = this.props.layout || 'cols';
    let help = this.props.help || '';

    let extraProps = {};
    if (this.props.autoFocus) {
      extraProps.autoFocus = this.props.autoFocus;
    }
    if (this.props.name) {
      extraProps.name = this.props.name;
    }
    if (this.props.value) {
      extraProps.value = this.props.value;
    }
    if (this.props.defaultValue) {
      extraProps.defaultValue = this.props.defaultValue;
    }
    if (this.props.onChange) {
      extraProps.onChange = this.props.onChange;
    }
    if (this.props.min) {
      extraProps.min = this.props.min;
    }
    if (this.props.max) {
      extraProps.max = this.props.max;
    }
    if (this.props.step) {
      extraProps.step = this.props.step;
    }
    if (this.props.onChange) {
      extraProps.onChange = this.props.onChange;
    }
    if (typeof this.props.autoComplete !== 'undefined') {
      extraProps.autoComplete = this.props.autoComplete;
    }

    if (!input) {
      let inputSize = this.props.size ? 'input-' + this.props.size : '';

      if (type === 'textarea') {
        input = (
          <textarea
            ref="input"
            required={required}
            {...extraProps}
            type={type}
            className={'form-control ' + inputSize}
            id={id}
            placeholder={placeholder}
          />
        );
      } else {
        input = (
          <input
            ref="input"
            required={required}
            {...extraProps}
            type={type}
            className={'form-control ' + inputSize}
            id={id}
            placeholder={placeholder}
          />
        );
      }
    }

    if (this.props.button) {
      input = (
        <div className="input-group">
          {this.props.prefix && (
            <span className="input-group-addon">{this.props.prefix}</span>
          )}
          {input}
          <span className="input-group-btn">{this.props.button}</span>
        </div>
      );
    } else if (this.props.prefix) {
      input = (
        <div className="input-group">
          {this.props.prefix && (
            <span className="input-group-addon">{this.props.prefix}</span>
          )}
          {input}
        </div>
      );
    }

    let labelClassName =
      layout === 'cols' ? 'col-sm-4 control-label' : 'control-label';

    let errors = this.props.errors || {};
    let hasError = Object.keys(errors).length > 0;

    return (
      <div className={hasError ? 'form-group has-error' : 'form-group'}>
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {required && (
              <span className="required" title="Campo Requerido">
                {' '}
                *{' '}
              </span>
            )}
            {label}
            :
          </label>
        )}
        {layout === 'cols' && (
          <div className={label ? 'col-sm-8' : 'col-sm-12'}>
            {input}
            {hasError &&
              Object.keys(errors).map(key => {
                return (
                  <p key={key} className="help-block">
                    {errors[key]}
                  </p>
                );
              })}

            {!hasError && help && <p className="help-block">{help}</p>}
          </div>
        )}
        {layout === 'rows' && (
          <div>
            {input}
            {hasError &&
              Object.keys(errors).map(key => {
                return (
                  <p key={key} className="help-block">
                    {errors[key]}
                  </p>
                );
              })}

            {!hasError && help && <p className="help-block">{help}</p>}
          </div>
        )}
      </div>
    );
  }
}

export class InputStatic extends Component {
  render() {
    let label = this.props.label || 'label';
    let value = this.props.value || '';
    let layout = this.props.layout || 'cols';

    let labelClassName =
      layout === 'cols' ? 'col-sm-4 control-label' : 'control-label';
    let input = <p className="form-control-static">{value}</p>;

    return (
      <div className="form-group">
        <label className={labelClassName}>{label}:</label>
        {layout === 'cols' && <div className="col-sm-8">{input}</div>}
        {layout === 'rows' && input}
      </div>
    );
  }
}

export class FormFooter extends Component {
  render() {
    return (
      <div className="form-group">
        {this.props.layout === 'rows' && (
          <div>{this.props.children || <div>item</div>}</div>
        )}
        {this.props.layout !== 'rows' && (
          <div className="col-sm-8 col-sm-offset-4">
            {this.props.children || <div>item</div>}
          </div>
        )}
      </div>
    );
  }
}

export class FormHeader extends Component {
  render() {
    return (
      <div className="form-group">
        <div className="col-sm-8 col-sm-offset-4">
          {this.props.children || <div>item</div>}
        </div>
      </div>
    );
  }
}

export class Form extends Component {
  render() {
    let type = this.props.type || 'horizontal';
    let className =
      `form-${type} ` + (this.props.className ? this.props.className : '');
    let encType = this.props.encType || 'application/x-www-form-urlencoded';

    return (
      <form
        onSubmit={this.props.onSubmit}
        encType={encType}
        className={className}
      >
        {this.props.children}
      </form>
    );
  }
}
