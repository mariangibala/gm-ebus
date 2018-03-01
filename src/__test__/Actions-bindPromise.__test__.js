'use strict'

import {EventsBus, Actions, Store}  from '../index'
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

    class AppActions extends Actions {

      @bindPromise
      increaseState(increaseValue,) {
        return Q.Promise(resolve => {
          setTimeout(function () {
            resolve(increaseValue)
          }, 10)
        })
      }
    }


    const actions = new AppActions(EBus)
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



