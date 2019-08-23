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

import BienvenuePanel from './BienvenuePanel'
var {
  Grid,
  Row,
  Col
} = ReactBootstrap

var BienvenueContainer = createReactClass({

  getInitialState: function () {
    return {
      status: 'initial'
    }
  },

  UNSAFE_componentWillMount: function () {
    this.controller = require('./controller-BienvenueContainer').default(this.props.controller, this)
  },

  UNSAFE_componentWillReceiveProps: function (newProps) {
    this.onNewProps(newProps)
  },

  render: function () {
    // var componentPath = this.controller.updateComponentPath(this);

    return (
      <Grid
        fluid
        className={this.hideContainer ? 'hidden' : ''}
      >
        <Row>
          <Col md={12}>
            <BienvenuePanel
              controller={this.controller}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default BienvenueContainer
