/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Relay) Système Expert sous Mumps GT.M et GNU/Linux        !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

'use strict'

var React = require('react')
var createReactClass = require('create-react-class')
var ReactBootstrap = require('react-bootstrap')
var {
  Grid,
  Row,
  Col
} = ReactBootstrap

var DocumentStorePanel = require('./DocumentStorePanel')

var DocumentStoreContainer = createReactClass({

  getInitialState: function () {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function () {
    this.controller = require('./controller-DocumentStoreContainer')(this.props.controller, this)
  },

  componentWillReceiveProps: function (newProps) {
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
            <DocumentStorePanel
              controller={this.controller}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
})

module.exports = DocumentStoreContainer
