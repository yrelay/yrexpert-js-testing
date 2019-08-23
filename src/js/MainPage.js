/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Relay) Système Expert sous Mumps GT.M et GNU/Linux        !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

'use strict'

import { createFactory } from 'react'
import createReactClass from 'create-react-class'
import ReactToastr, { ToastMessage } from 'react-toastr'
import jQuery from 'jquery'

import LoginRpcModal from './loginrpc/LoginRpcModal'
import Banner from './Banner'
import Content from './Content'
import Shutdown from './Shutdown'
window.$ = window.jQuery = jQuery

var { ToastContainer } = ReactToastr
var ToastMessageFactory = createFactory(ToastMessage.animation)

var controller
var title = 'yrexpert-js'

var MainPage = createReactClass({

  getInitialState: function () {
    return {
      status: 'initial'
    }
  },

  UNSAFE_componentWillMount: function () {
    controller = require('./controller-MainPage')(this.props.controller, this)
  },

  render: function () {
    // console.log('rendering MainPage');
    // var componentPath = controller.updateComponentPath(this);

    if (this.state.status === 'shutdown') {
      return (
        <Shutdown
          title={title}
        />
      )
    }

    return (
      <div>
        <Banner
          title={title}
          controller={controller}
        />

        <ToastContainer
          ref='toastContainer'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-right'
          newestOnTop
          target='body'
        />

        <LoginRpcModal
          controller={controller}
          show={this.showLoginModal}
        />

        <Content
          controller={controller}
          status={this.state.status}
        />

      </div>

    )
  }
})

export default MainPage
