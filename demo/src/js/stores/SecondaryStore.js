'use strict'

import EBus from '../EBus'
import AppActions from '../actions/AppActions'
import {Store}  from '../../../../lib'


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


class SecondaryStore extends Store {
  static model = SecondaryStoreModel
  setCustomFunc(){}
}

const store = new SecondaryStore(EBus)

export default store

