'use strict'

import doRequest from '../API'
import { bindPromise, Actions } from '../../../../lib'

class AppActionsModel extends Actions {
  static id = 'AppActions'

  /**
   * Example of manual promise handling
   */
  callFooAPI() {
    doRequest('/foo')
      .then((result) => {
        this.callFooAPICustomSuccessFunc(result)
      })
      .catch((err) => {
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
    return doRequest('/bar')
  }
}

export default AppActionsModel
