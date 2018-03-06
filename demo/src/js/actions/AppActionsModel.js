'use strict'

import doRequest from '../API'
import {bindPromise, Actions}  from '../../../../lib'

class AppActionsModel extends Actions {

  static id = 'AppActions'

  /**
   * Example of manual promise handling
   */
  callFooAPI() {
    doRequest('/a').then(result => {
      this.callFooAPICustomSuccessFunc(result)
    }).catch(err => {
      console.log(err)
    })
  }

  callFooAPICustomSuccessFunc(data) {
    return data
  }

  /**
   * bindPromise will create callBarAPISuccess function
   */
  @bindPromise
  callBarAPI() {
    return doRequest('/b')
  }

}

export default AppActionsModel

