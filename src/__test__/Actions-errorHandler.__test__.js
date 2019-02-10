'use strict'

import { EventsBus, Actions, Store } from '../index'
import bindPromise from '../actions/bindPromise'
const sinon = require('sinon')

// Shared actions class rejecting async call
class AppActions extends Actions {
  @bindPromise
  simulateReject() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        reject('Some custom err')
      }, 10)
    })
  }
}

describe('Actions - errorHandler ', () => {
  let EBus

  class AppStore extends Store {
    static model = class {
      value = 0
    }
  }

  beforeEach(function() {
    EBus = new EventsBus()
  })

  it('calls custom err handler', function(done) {
    let errHandlerCalled = 0

    EBus = new EventsBus({
      actionsErrorHandler: (err) => {
        errHandlerCalled++
      },
    })

    const actions = new AppActions(EBus)
    actions.simulateReject()

    setTimeout(function() {
      assert.equal(errHandlerCalled, 1)
      done()
    }, 50)
  })

  it('default err handler works correctly', function(done) {
    sinon.stub(console, 'error').callsFake(() => {})

    const actions = new AppActions(EBus)
    actions.simulateReject()

    setTimeout(function() {
      assert.equal(console.error.callCount, 1)
      console.error.restore()
      done()
    }, 50)
  })

  it('turns off default err handler', function(done) {
    sinon.stub(console, 'error').callsFake(() => {})

    EBus = new EventsBus({
      actionsErrorHandler: false,
    })

    const actions = new AppActions(EBus)
    actions.simulateReject()

    setTimeout(function() {
      assert.equal(console.error.callCount, 0)
      console.error.restore()
      done()
    }, 50)
  })
})
