'use strict'

import EBus from '../EBus'
import doRequest from '../API'
import {bindPromise}  from '../../../../lib'

class AppActions {

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

export default EBus.createActions(AppActions)

