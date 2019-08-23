/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');
var {
  Grid,
  Row,
  Col
} = ReactBootstrap;

var NouvPartitionPanel = require('./NouvPartitionPanel');

var NouvPartitionContainer = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  UNSAFE_componentWillMount: function() {
    this.controller = require('./controller-NouvPartitionContainer')(this.props.controller, this);
  },

  UNSAFE_componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    return (
      <Grid
        fluid = {true}
        className = {this.hideContainer ? 'hidden' : ''}
      >
        <Row>
          <Col md={12}>
            <NouvPartitionPanel
              controller = {this.controller}
            />
          </Col>
        </Row>
      </Grid>
    );

  }
});

module.exports = NouvPartitionContainer;



