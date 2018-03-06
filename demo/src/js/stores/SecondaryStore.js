'use strict'

import EBus from '../EBus'
import AppActions from '../actions/AppActions'
import {Store}  from '../../../../lib'

class SecondaryStore extends Store {
  static model = class {
    value = 100

    setCustomFunc(prop, value) {
      this[prop] = value
      this.emitChange()
    }

  }

  static $AppActions = class {
    callBarAPISuccess(result) {
      this.barAPI = result
    }
  }

  setCustomFunc(){}
}

const store = new SecondaryStore(EBus).connect(AppActions)

export default store

