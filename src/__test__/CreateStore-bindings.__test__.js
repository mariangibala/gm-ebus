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
      const store = new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })

  it('throws err when store tries to overwrite core method as method', function (done) {

    class AppStore extends Store {
      static model = class {
        listen() {}
      }
    }

    try {
      const store = new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })


  it('can bind actions from store constructor', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends Store {
      static model =  class {

        value = 0

        constructor() {
          this.connect(actions, handlers)
        }
      }
    }

    const store = new AppStore(EBus)

    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can bind actions on a mounted store', function (done) {

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

  it('can bind actions defined as a model connect prop', function (done) {

    const actions = new AppActions(EBus)

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    StoreModel.connect = [[
      actions, class {
        increaseState(increaseValue) {
          this.value += increaseValue
        }
      }
    ]]

    class AppStore extends Store {
      static model = StoreModel
    }

    const store = new AppStore(EBus)


    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can bind actions defined as a model connect prop for multiple actions', function (done) {

    const actions = new AppActions(EBus, {namespace: 'actions1'})
    const actions2 = new AppActions(EBus, {namespace: 'actions2'})

    class StoreModel {
      constructor() {
        this.value = 0
      }
    }

    StoreModel.connect = [[
      actions, class {
        increaseState(increaseValue) {
          this.value += increaseValue
        }
      }
    ], [
      actions2, class {
        increaseState(increaseValue) {
          this.value += increaseValue
        }
      }
    ]]

    class AppStore extends Store {
      static model = StoreModel
    }

    const store = new AppStore(EBus)

    actions.increaseState(1)
    actions.increaseState(1)

    actions2.increaseState(1)
    actions2.increaseState(1)


    assert.equal(store.getState().value, 4)

    done()

  })


})



