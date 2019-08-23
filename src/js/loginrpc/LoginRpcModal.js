/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

'use strict'

import React from 'react'
import createReactClass from 'create-react-class'
import ReactBootstrap from 'react-bootstrap'

import LoginRpcField from './LoginRpcField'

var {
  Button,
  Modal,
  Checkbox
} = ReactBootstrap

var LoginRpcModal = createReactClass({

  UNSAFE_componentWillMount: function () {
    this.controller = require('./controller-LoginRpcModal')(this.props.controller, this)
  },

  render: function () {
    // console.log('LoginRpcModal rendering');
    // var componentPath = this.controller.updateComponentPath(this);
    return (

      <Modal
        show={this.props.show}
        backdrop='static'
        bsStyle='primary'
        animation
        onKeyPress={this.handleKeyDown}
      >

        <Modal.Header>
          <Modal.Title>
              Authentification : Veuillez vous connecter.
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <LoginRpcField
            placeholderAc="Entrez votre code d'accès"
            fieldnameAc='ac'
            labelAc="Code d'accès"
            controllerAc={this.controller}
            focusAc

            placeholderVc='Entrez votre code de vérification'
            fieldnameVc='vc'
            labelVc='Code de vérification'
            controllerVc={this.controller}
            focusVc={false}

            controller={this.controller}
          />

          <Checkbox bsStyle='primary'>Changer votre code de vérification ?</Checkbox>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleLogin} bsStyle='primary'>Se connecter</Button>
        </Modal.Footer>

      </Modal>

    )
  }
})

export default LoginRpcModal
