/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

module.exports = function (controller, component) {
  component.data = {}
  component.token = ''
  component.beatryxId = ''

  component.title = 'Beatryx Data'

  component.onNewProps = function (newProps) {
    // console.log('controller-BeatryxDetails newProps: ' + JSON.stringify(newProps));
    component.data = newProps.data.data || {}
    if (newProps.data.id && newProps.data.id !== '') {
      component.title = 'Beatryx ' + newProps.data.id
    } else {
      // previously-displayed Beatryx no longer exists
      component.title = 'Beatryx Data'
      component.data = {}
    }
    if (newProps.data.token) component.token = newProps.data.token
  }

  component.expanded = true

  var expandText = ' -->'
  component.expand = false
  component.isExpanded = function (keypath, value) {
    return component.expand
  }

  function index (obj, is, value) {
    if (typeof is === 'string') {
      return index(obj, is.split('.'), value)
    } else if (is.length === 1 && value !== undefined) {
      return obj[is[0]] = value
    } else if (is.length === 0) {
      return obj
    } else {
      return index(obj[is[0]], is.slice(1), value)
    }
  }

  component.nodeClicked = function (obj) {
    if (obj.value === expandText) {
      var message = {
        type: 'getBeatryxSubscripts',
        params: {
          path: obj.path,
          expandText: expandText,
          token: component.token
        }
      }
      controller.send(message, function (responseObj) {
        if (responseObj.message.error) {
          // beatryx no longer exists, so refresh the entire beatryx display
          // console.log('beatryx no longer exists so refresh beatryx display');
          controller.emit('refreshBeatryxDisplay')
        } else {
          index(component.data, obj.path, responseObj.message.data)
          component.expand = true
          component.setState({ status: 'updated' })
        }
      })
    }
  }

  return controller
}
