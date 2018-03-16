'use strict'

import {EventsBus, Actions, Store}  from '../index'
import {StoreModel, AppActions, handlers} from './shared/app'

describe('CreateStore - bindings', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('throws err when storeModel tries to overwrite core method in constructor', function (done) {

    class AppStore extends Store {
      static model = class {
        constructor() {
          this.listen = () => {}
        }
      }
    }

    try {
      new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })

  it('throws err when store is trying to overwrite core method', function (done) {

    class AppStore extends Store {
      static model = class {
        listen() {}
      }
    }

    try {
      new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })


  it('throws err when connecting actions from store constructor', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model =  class {
        constructor() {
          this.connect(actions, handlers)
        }
      }
    }

    try {
      new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })


  it('connect returns correct model', function (done) {

    /**
     * connect is supposed to return a public instance with exposed methods,
     * NOT internal store model
     */

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model = StoreModel
    }

    const store = new AppStore(EBus).connect(actions, handlers)

    assert.equal(store.constructor === AppStore, true)

    done()

  })


  it('can connect actions to a mounted store', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model = StoreModel
    }

    const store = new AppStore(EBus)

    store.connect(actions, handlers)

    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can connect actions to a static handler', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model =  class {
        value = 0
      }

      static $AppActions = class {
        increaseState(increaseValue) {
          this.value += increaseValue
        }
      }
    }

    const store = new AppStore(EBus).connect(actions)


    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can connect multiple instance actions to a static handler', function (done) {

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

    const store = new AppStore(EBus)
      .connect(actions)
      .connect(actions2)

    actions.increaseState(1)
    actions.increaseState(1)

    actions2.increaseState(1)
    actions2.increaseState(1)


    assert.equal(store.getState().value, 4)

    done()

  })


})



