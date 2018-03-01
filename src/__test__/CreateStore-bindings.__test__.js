'use strict'

import {EventsBus, Actions}  from '../index'
import {StoreModel, AppActions, handlers} from './shared/app'

describe('CreateStore - bindings', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('throws err when storeModel tries to overwrite core method in constructor', function (done) {

    class StoreModel {
      constructor() {
        this.listen = () => {}
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    try {
      const store = new AppStore()
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })

  it('throws err when store tries to overwrite core method as method', function (done) {

    class StoreModel {
      listen() {}
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    try {
      const store = new AppStore()
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }

  })


  it('can bind actions from store constructor', function (done) {

    const actions = new AppActions(EBus)

    class StoreModel {

      value = 0

      constructor() {
        this.connect(actions, handlers)
      }
    }

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore()

    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can bind actions on mounted store', function (done) {

    const actions = new AppActions(EBus)

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore()

    store.connect(actions, handlers)

    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can bind actions defined as a store connect prop', function (done) {

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

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore()


    actions.increaseState(1)
    actions.increaseState(1)
    actions.increaseState(1)

    assert.equal(store.getState().value, 3)

    done()

  })

  it('can bind actions defined as a store connect prop for multiple actions', function (done) {

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

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store = new AppStore()

    actions.increaseState(1)
    actions.increaseState(1)

    actions2.increaseState(1)
    actions2.increaseState(1)


    assert.equal(store.getState().value, 4)

    done()

  })


})



