'use strict'

import {EventsBus}  from '../index'
import {StoreModel, AppActions, handlers} from './shared/app'
import doubleNumbers from './shared/doubleNumbers'


describe('Middleware - store', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('connects middleware to store "native" function', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })


    store.set('value', 5)

    assert.equal(store.getState().value, 10)
    done()

  })

  /////////////////////////

  it('connects middleware to store func defined in constructor', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0

        this.someMethod = function (x) {
          this.value = x
        }
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })

    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to store ARROW func defined in constructor', function (done) {


    class StoreModel {
      constructor() {
        this.value = 0

        this.someMethod = (x) => {
          this.value = x
        }
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to store method binded with arrow func', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0
      }

      someMethod = (x) => {
        this.value = x
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to store method', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0
      }

      someMethod(x) {
        this.value = x
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      callSomeMethod(x) {
        this.someMethod(x)
      }
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })


    store.callSomeMethod(5)

    // It doubles twice -> interface + internal method
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to a connected action handler created in constructor', function (done) {

    const actions = new AppActions(EBus)

    class StoreModel {
      constructor() {
        this.value = 0
        this.connect(actions, handlers)
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })

    actions.increaseState(5)

    // __emitAction, increaseState
    assert.equal(store.getState().value, 20)
    done()

  })

  /////////////////////////

  it('connects middleware to an action handler created after mounting', function (done) {

    const actions = new AppActions(EBus)

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore ({
      middleware: [doubleNumbers]
    })

    store.connect(actions, handlers)

    actions.increaseState(5)

    // __emitAction, increaseState
    assert.equal(store.getState().value, 20)
    done()

  })


  /////////////////////////

  it('connects multiple middleware to a native method', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore ({
      middleware: [doubleNumbers, doubleNumbers, {connect: doubleNumbers}]
    })

    store.set('value', 5)

    assert.equal(store.getState().value, 40)
    done()

  })


  /////////////////////////

  it('connects Object middleware to a native method', function (done) {

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore ({
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

    class StoreModel {
      constructor() {
        this.value = 0
      }

      methodB(x) {
        this.value = x
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore ({
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

    class StoreModel {
      constructor() {
        this.value = 0
      }

      methodB(x) {
        this.value = x
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore ({
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

    class StoreModel {
      constructor() {
        this.value = 0
      }

      methodB(x) {
        this.value = x
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel

      methodA(x) {
        this.methodB(x)
      }
    }

    const store = new AppStore ({
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



