'use strict'

import EBus from '../EBus'
import AppActions from '../actions/AppActions'

class MainStoreModel {
  value = 'Starting value'
  sliderValue = 50
  apiA = null
  apiB = null
}

MainStoreModel.connect = [[
  AppActions,
  class {
    gotSomeData(result) {
      this.apiA = result
    }

    getSomeOtherDataSuccess(result) {
      this.apiB = result
    }
  }
]]


class MainStore extends EBus.Store {
  static model = MainStoreModel
}

const store = new MainStore()

export default store

