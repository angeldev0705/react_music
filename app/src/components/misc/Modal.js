import React from 'react';
import { Modal as BaseModal } from 'react-bootstrap';
//import {DropModal as BaseModal} from 'boron';
//let BaseModal = require('boron/WaveModal');

export class Modal extends React.Component {
  static contextTypes = {
    isMobile: React.PropTypes.bool.isRequired
  };

  render() {
    //        let backdrop = this.context.isMobile ? 'static' : true;
    let backdrop = true;

    return (
      <BaseModal
        backdrop={backdrop}
        show={true}
        animation={false}
        bsSize={this.props.size}
        {...this.props}
      >
        {this.props.children}
      </BaseModal>
    );
  }
}
