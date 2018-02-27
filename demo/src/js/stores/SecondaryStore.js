'use strict'

import EBus from '../EBus'
import AppActions from '../actions/AppActions'

class SecondaryStoreModel {

  value = 100

  setCustomFunc(prop, value) {
    this[prop] = value
    this.emitChange()
  }

}

SecondaryStoreModel.connect = [[
  AppActions,
  class {
    getSomeOtherDataSuccess(result) {
      this.apiB = result
    }
  }
]]


class SecondaryStore extends EBus.Store {
  static model = SecondaryStoreModel
  setCustomFunc(){}
}

const store = new SecondaryStore()

export default store

