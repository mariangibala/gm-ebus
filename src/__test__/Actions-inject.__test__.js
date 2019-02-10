'use strict'

import { EventsBus, Actions, Store } from '../index'

describe('Actions - dependencies', () => {
  let EBus

  class AppStore extends Store {
    static model = class {
      value = 0
    }
  }

  class AppActions2 extends Actions {
    static id = 'AppActions2'

    increaseState(increaseValue) {
      return increaseValue
    }
  }

  beforeEach(function() {
    EBus = EventsBus()
  })

  ////////////////////

  it('can use injected actions', function(done) {
    class AppActions extends Actions {
      increaseState(increaseValue) {
        this.$AppActions2.increaseState(increaseValue)
      }
    }

    const actions2 = new AppActions2(EBus)
    const actions = new AppActions(EBus, { inject: [actions2] })

    const store = new AppStore(EBus).connect(actions2, {
      increaseState(val) {
        this.value += val
      },
    })

    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 2)
    done()
  })

  ////////////////////

  it('can use injected actions in promise', function(done) {
    class AppActions extends Actions {
      increaseState(increaseValue) {
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(increaseValue)
          }, 10)
        }).then((result) => {
          this.$AppActions2.increaseState(result)
        })
      }
    }

    class AppActions2 extends Actions {
      static id = 'AppActions2'

      increaseState(increaseValue) {
        return increaseValue
      }
    }

    const actions2 = new AppActions2(EBus)
    const actions = new AppActions(EBus, { inject: [actions2] })

    const store = new AppStore(EBus).connect(actions2, {
      increaseState(val) {
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

  ////////////////////

  it('throws when injected actions id is missing', function(done) {
    class AppActions extends Actions {}
    class AppActions2 extends Actions {}

    const actions2 = new AppActions2(EBus)

    try {
      new AppActions(EBus, { inject: [actions2] })
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }
  })
})
