import React from 'react';
import { Component } from '../../base/Component';
import { Login } from './Login';
import { Icon } from '../misc/Icon';
import { FacebookLogin } from '../account/FacebookLogin';
import { Modal } from '../misc/Modal';
import { Ads } from '../ads/Ads';
import { SEOUtil } from '../../util/Util';
import { Config } from '../../Config';

export class PreLoginModal extends Component {
  state = {
    showLogin: false
  };

  onSuccess() {
    console.log('login modal success');

    if (typeof this.props.onSuccess === 'function') {
      this.props.onSuccess();
    }

    if (typeof this.props.onHide === 'function') {
      this.props.onHide();
    }
  }

  render() {
    return (
      <Modal
        ref="modal"
        className={this.state.showLogin ? 'login-modal' : ''}
        size="md"
        onHide={this.props.onHide.bind(this)}
      >
        <div className="modal-header">
          <button className="close" onTouchTap={this.props.onHide.bind(this)}>
            <Icon name="close" />
          </button>
          <h4 className="modal-title">
            {this.state.showLogin ? 'Iniciar sesión' : Config.app.name}
          </h4>
        </div>
        <div className="modal-body">
          <div className="row">
            {this.state.showLogin && (
              <Login onSuccess={this.onSuccess.bind(this)} />
            )}
            {!this.state.showLogin && (
              <div>
                <div className="form-group">
                  <div className="center-container">
                    <FacebookLogin onSuccess={this.onSuccess.bind(this)}>
                      Conectar con facebook
                    </FacebookLogin>
                  </div>
                </div>

                <div className="form-group">
                  <div className="center-container">
                    <button
                      onTouchTap={() => this.setState({ showLogin: true })}
                      className="btn btn-default btn-lg"
                    >
                      Iniciar sesión en {Config.app.name}
                    </button>
                  </div>
                </div>

                {Config.ads.enabled &&
                  !this.context.isMobile &&
                  !SEOUtil.isSEORequest() && <Ads size="234x60" />}
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
