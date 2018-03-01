'use strict'

import EBus from '../EBus'
import doRequest from '../API'
import {bindPromise, Actions}  from '../../../../lib'

class AppActions extends Actions {

  /**
   * Example of manual promise handling
   */
  getSomeData() {
    doRequest('/a').then(result => {
      this.gotSomeData(result)
    }).catch(err => {
      console.log(err)
    })
  }

  gotSomeData(data) {
    return data
  }

  /**
   * bindPromise will create getSomeOtherDataSuccess function
   */
  @bindPromise
  getSomeOtherData() {
    return doRequest('/b')
  }

}

export default new AppActions(EBus)

