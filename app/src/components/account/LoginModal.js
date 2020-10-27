import React from 'react';
import { Component } from '../../base/Component';
import { Login } from './Login';
import { Icon } from '../misc/Icon';
import { Modal } from '../misc/Modal';

export class LoginModal extends Component {
  onSuccess() {
    console.log('login modal success');

    if (typeof this.props.onSuccess === 'function') {
      this.props.onSuccess();
    }

    if (typeof this.props.onHide === 'function') {
      console.log('login modal closeee');
      this.props.onHide();
    }
  }

  render() {
    //        {typeof this.props.onSuccess === 'function' &&
    //        <Alert message="Para continuar, debes Iniciar sesión"/>
    //        }
    return (
      <Modal
        ref="modal"
        className="login-modal"
        size="md"
        onHide={this.props.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.props.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <h4 className="modal-title">Iniciar sesión</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <Login onSuccess={this.onSuccess.bind(this)} />
          </div>
        </div>
      </Modal>
    );
  }
}
