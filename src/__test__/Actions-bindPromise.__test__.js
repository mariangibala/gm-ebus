'use strict'

import {EventsBus}  from '../index'
import bindPromise from '../actions/bindPromise'
const Q = require('q')

describe('Actions - bindPromise', () => {

  let EBus
  let AppStore


  beforeEach(function () {
    EBus = EventsBus()

    AppStore = class extends EBus.Store {
      static model = class {
        value = 0
      }
    }
  })


  it('bindsPromise - decorator method', function (done) {

    class AppActions {

      @bindPromise
      increaseState(increaseValue,) {
        return Q.Promise(resolve => {
          setTimeout(function () {
            resolve(increaseValue)
          }, 10)
        })
      }
    }

    const actions = EBus.createActions(AppActions)
    const store = new AppStore()

    store.connect(actions, {
      increaseStateSuccess(val) {
        this.value += val
      }
    })

    actions.increaseState(1)
    actions.increaseState(1)


    setTimeout(function () {
      assert.equal(store.getState().value, 2)
      done()

    }, 50)


  })


})



