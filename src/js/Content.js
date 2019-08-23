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

// Fichier
import RobotAndyContainer from './andy/RobotAndyContainer'
import BeatryxRobotContainer from './beatryx/BeatryxRobotContainer'

// Editer

// Navigation

// Rechercher
import RechercherFichierContainer from './rechercherfichier/RechercherFichierContainer'

// Partition
import AllerPartitionContainer from './allerpartition/AllerPartitionContainer'

// Exécuter
import TerminalContainer from './terminal/TerminalContainer'
import OverviewContainer from './overview/OverviewContainer'
import DocumentStoreContainer from './document/DocumentStoreContainer'
import SessionsContainer from './session/SessionsContainer'

// Fenêtre

// Aide
import BienvenueContainer from './bienvenue/BienvenueContainer'
import AproposContainer from './apropos/AproposContainer'

var Content = createReactClass({

  getInitialState: function () {
    return {
      status: 'initial'
    }
  },

  UNSAFE_componentWillMount: function () {
    this.controller = require('./controller-Content')(this.props.controller, this)
  },

  UNSAFE_componentWillReceiveProps: function (newProps) {
    this.onNewProps(newProps)
  },

  render: function () {
    // var componentPath = this.controller.updateComponentPath(this);

    if (this.status === 'initial') {
      return (
        <div />
      )
    } else {
      return (
        <div>
          <RobotAndyContainer controller={this.controller} status={this.status} />
          <BeatryxRobotContainer controller={this.controller} status={this.status} />

          <RechercherFichierContainer controller={this.controller} status={this.status} />

          <AllerPartitionContainer controller={this.controller} status={this.status} />

          <TerminalContainer controller={this.controller} status={this.status} />
          <OverviewContainer controller={this.controller} status={this.status} />
          <DocumentStoreContainer controller={this.controller} status={this.status} />
          <SessionsContainer controller={this.controller} status={this.status} />

          <BienvenueContainer controller={this.controller} status={this.status} />
          <AproposContainer controller={this.controller} status={this.status} />

        </div>
      )
    }
  }
})

export default Content
