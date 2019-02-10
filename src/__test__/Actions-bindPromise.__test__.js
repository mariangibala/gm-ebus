'use strict'

import { EventsBus, Actions, Store } from '../index'
import bindPromise from '../actions/bindPromise'

const Q = require('q')

describe('Actions - bindPromise', () => {
  let EBus

  class AppStore extends Store {
    static model = class {
      value = 0
    }
  }

  beforeEach(function() {
    EBus = EventsBus()
  })

  it('bindsPromise - decorator method (Q)', function(done) {
    class AppActions extends Actions {
      @bindPromise
      increaseState(increaseValue) {
        return Q.Promise((resolve) => {
          setTimeout(function() {
            resolve(increaseValue)
          }, 10)
        })
      }
    }

    const actions = new AppActions(EBus)

    const store = new AppStore(EBus).connect(actions, {
      increaseStateSuccess(val) {
        this.value += val
      },
    })

    actions.increaseState(1)
    actions.increaseState(1)

    setTimeout(function() {
      assert.equal(store.getState().value, 2)
      done()
    }, 50)
  })

  it('bindsPromise - decorator method (native Promise)', function(done) {
    class AppActions extends Actions {
      @bindPromise
      increaseState(increaseValue) {
        return new Promise((resolve) => {
          setTimeout(function() {
            resolve(increaseValue)
          }, 10)
        })
      }
    }

    const actions = new AppActions(EBus)

    const store = new AppStore(EBus).connect(actions, {
      increaseStateSuccess(val) {
        this.value += val
      },
    })

    actions.increaseState(1)
    actions.increaseState(1)

    setTimeout(function() {
      assert.equal(store.getState().value, 2)
      done()
    }, 50)
  })

  it('@bindPromise - throws when func is missing return statement', function(done) {
    try {
      class AppActions extends Actions {
        @bindPromise
        increaseState() {}
      }
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }
  })
})
