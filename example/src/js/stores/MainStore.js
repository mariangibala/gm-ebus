'use strict'

import EBus from '../EBus'
import { Store } from '../../../../lib'
import AppActions from '../actions/AppActions'

class MainStore extends Store {
  static model = class {
    value = 'Starting value'
    sliderValue = 50
    fooAPI = null
    barAPI = null
  }

  static $AppActions = class {
    callFooAPICustomSuccessFunc(result) {
      this.fooAPI = result
    }

    callBarAPISuccess(result) {
      this.barAPI = result
    }
  }
}

const store = new MainStore(EBus).connect(AppActions)

export default store
