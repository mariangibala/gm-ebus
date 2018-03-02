'use strict'

import {EventsBus, Store} from '../index'
import {StoreModel, AppActions, handlers} from './shared/app'
import doubleNumbers from './shared/doubleNumbers'


describe('Middleware - store', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('connects middleware <--> store "native" function', function (done) {

    class AppStore extends Store {
      static model = class {
        value = 0
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })


    store.set('value', 5)

    assert.equal(store.getState().value, 10)
    done()

  })

  /////////////////////////

  it('connects middleware <--> store func defined in constructor', function (done) {

    class AppStore extends Store {
      static model = class {
        constructor() {
          this.value = 0

          this.someMethod = function (x) {
            this.value = x
          }
        }
      }

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })

    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware <--> store ARROW func defined in constructor', function (done) {


    class AppStore extends Store {
      static model = class {
        constructor() {
          this.value = 0

          this.someMethod = (x) => {
            this.value = x
          }
        }
      }

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware <--> store method binded with arrow func', function (done) {

    class AppStore extends Store {
      static model = class {
        value = 0

        someMethod = (x) => {
          this.value = x
        }
      }

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware <--> store method', function (done) {


    class AppStore extends Store {
      static model = class {
        value = 0

        someMethod(x) {
          this.value = x
        }
      }

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })


  /////////////////////////

  it('connects middleware to an action handler passed as an argument', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model = class {
        value = 0
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })

    store.connect(actions, handlers)

    actions.increaseState(5)

    // __emitAction, increaseState
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to an action handler defined as a static', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model = class {
        value = 0
      }

      static $AppActions = class {
        increaseState(increaseValue) {
          this.value += increaseValue
        }
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers]
    })

    store.connect(actions)

    actions.increaseState(5)

    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to an action handler defined as a static (multiple instances)',
    function (done) {

      const actions = new AppActions(EBus, {namespace: 'actions1'})
      const actions2 = new AppActions(EBus, {namespace: 'actions2'})

      class AppStore extends Store {
        static model = class {
          value = 0
        }

        static $AppActions = class {
          increaseState(increaseValue) {
            this.value += increaseValue
          }
        }
      }

      const store = new AppStore(EBus, {
        middleware: [doubleNumbers]
      })

      store.connect(actions)
      store.connect(actions2)

      actions.increaseState(5)
      actions2.increaseState(5)

      assert.equal(store.getState().value, 40)
      done()

    })

  /////////////////////////

  it('connects multiple middleware to a native method', function (done) {

    class AppStore extends Store {
      static model = class {
        value = 0
      }
    }

    const store = new AppStore(EBus, {
      middleware: [doubleNumbers, doubleNumbers, {connect: doubleNumbers}]
    })

    store.set('value', 5)

    assert.equal(store.getState().value, 40)
    done()

  })


  /////////////////////////

  it('connects Object middleware to a native method', function (done) {

    class AppStore extends Store {
      static model = class {
        value = 0
      }
    }

    const store = new AppStore(EBus, {
      middleware: [{
        connect: doubleNumbers
      }]
    })


    store.set('value', 5)

    assert.equal(store.getState().value, 10)
    done()

  })

  /////////////////////////

  it('Object middleware respects connection config "isActive" field', function (done) {


    class AppStore extends Store {
      static model = class {
        value = 0

        methodB(x) {
          this.value = x
        }
      }

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [
        {
          connect: doubleNumbers,
          isActive: false
        }
      ]
    })


    store.methodA(5)

    assert.equal(store.getState().value, 5)
    done()

  })

  /////////////////////////

  it('Object middleware respects connection config "only" field', function (done) {

    class AppStore extends Store {
      static model = class {
        value = 0

        methodB(x) {
          this.value = x
        }
      }

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [
        {
          connect: doubleNumbers,
          only: ['methodB']
        }
      ]
    })

    store.methodA(5)

    assert.equal(store.getState().value, 10)
    done()

  })

  /////////////////////////

  it('Object middleware respects connection config "exclude" field', function (done) {

    class AppStore extends Store {
      static model = class StoreModel {
        value = 0

        methodB(x) {
          this.value = x
        }
      }

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore(EBus, {
      middleware: [
        {
          connect: doubleNumbers,
          exclude: ['methodB']
        }
      ]
    })


    store.methodA(5)

    assert.equal(store.getState().value, 10)
    done()

  })


})



