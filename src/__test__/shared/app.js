'use strict'

const Q = require('q')
import { bindPromise, Actions } from '../../index'

class StoreModel {
  value = 0

  increaseStateDirectMethod(increaseValue) {
    this.value += increaseValue
    this.emitChange()
  }
}

const handlers = {
  increaseState(increaseValue) {
    this.value += increaseValue
  },

  increaseStateByPromiseSuccess(increaseValue) {
    this.value += increaseValue
  },
}

class AppActions extends Actions {
  static id = 'AppActions'

  @bindPromise
  increaseStateByPromise(increaseValue, { shouldReject } = {}) {
    return Q.Promise((resolve, reject) => {
      setTimeout(function() {
        if (shouldReject) {
          reject(new Error('Some promise Error'))
          return
        }
        resolve(increaseValue)
      }, 10)
    })
  }

  increaseState(increaseValue) {
    return increaseValue
  }
}

export { handlers, StoreModel, AppActions }
