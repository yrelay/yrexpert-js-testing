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

var {
  FormGroup,
  FormLabel,
  FormControl
} = ReactBootstrap

var LoginRpcField = createReactClass({

  getInitialState: function () {
    return {
      value: '',
      valueAc: '',
      valueVc: ''
    }
  },

  UNSAFE_componentWillMount: function () {
    this.controller = require('./controller-LoginRpcField').default(this.props.controller, this)
  },

  render: function () {
    // console.log('LoginRpcField rendering');
    // this.controller.updateComponentPath(this);

    return (
      <div>
        <form>
          <FormGroup
            controlId='formAc'
          >
            <FormLabel>{this.props.labelAc}</FormLabel>
            <FormControl
              type='text'
              autoFocus={this.props.focusAc}
              value={this.state.valueAc}
              placeholder={this.props.placeholderAc}
              bsStyle='primary'
              ref={this.props.fieldnameAc}
              onChange={this.handleChangeAc}
            />
            <FormControl.Feedback />

          </FormGroup>

          <FormGroup
            controlId='formVc'
          >
            <FormLabel>{this.props.labelVc}</FormLabel>
            <FormControl
              type='password'
              autoFocus={this.props.focusVc}
              value={this.state.valueVc}
              placeholder={this.props.placeholderVc}
              bsStyle='primary'
              ref={this.props.fieldnameVc}
              onChange={this.handleChangeVc}
            />
            <FormControl.Feedback />

          </FormGroup>

        </form>

      </div>
    )
  }
})

export default LoginRpcField

// Votre code d'accès est habituellement la première lettre du prénom suivi de votre nom.
// Votre code de vérification est celui que vous avez vous-même choisi.
