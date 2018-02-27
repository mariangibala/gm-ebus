'use strict'

import {EventsBus}  from '../index'
import {AppActions, StoreModel, handlers} from './shared/app'

describe('PubSub', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('calls callback for new listener, returns state in callback argument', function (done) {

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store1 = new AppStore()

    let componentState

    function onChange1(state) {
      componentState = state
    }

    store1.listen(onChange1)

    expect(componentState).to.be.a('object')
    assert.equal(componentState.value, 0)

    // make sure that anything else isn't attached to state
    assert.equal(Object.keys(componentState).length, 1)

    done()
  })

  it('pub/sub sync action', function (done) {

    const sessionActions = EBus.createActions(AppActions)
    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store1 = new AppStore('store1')
    const store2 = new AppStore('store2')

    store1.connect(sessionActions, handlers)
    store2.connect(sessionActions, handlers)

    let onChangeCalled = 0

    function onChange(state) {
      onChangeCalled++
    }

    store1.listen(onChange)
    store2.listen(onChange)

    sessionActions.increaseState(1)
    sessionActions.increaseState(1)
    sessionActions.increaseState(1)

    assert.equal(store1.getState().value, 3)
    assert.equal(store2.getState().value, 3)

    // make sure that anything else isn't attached to state
    assert.equal(Object.keys(store1.getState()).length, 1)
    assert.equal(Object.keys(store2.getState()).length, 1)

    assert.equal(onChangeCalled, 8)

    done()

  })


  it('basic sync + async pub/sub', function (done) {

    const sessionActions = EBus.createActions(AppActions)

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store1 = new AppStore('store1')
    const store2 = new AppStore('store2')

    store1.connect(sessionActions, handlers)
    store2.connect(sessionActions, handlers)

    let onChangeCalled = 0

    function onChange(state) {
      onChangeCalled++
    }


    store1.listen(onChange)
    store2.listen(onChange)

    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)
    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)
    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)

    sessionActions.increaseStateByPromise(1, {shouldReject: true})

    setTimeout(function () {

      assert.equal(store1.getState().value, 6)
      assert.equal(store2.getState().value, 6)

      // make sure that anything else isn't attached to state
      assert.equal(Object.keys(store1.getState()).length, 1)
      assert.equal(Object.keys(store2.getState()).length, 1)

      assert.equal(onChangeCalled, 14)
      done()
    }, 100)

  })

  it('basic pub/sub with batch', function (done) {

    const sessionActions = EBus.createActions(AppActions)

    class AppStore extends EBus.Store {
      static model = StoreModel
    }

    const store1 = new AppStore({name: 'AppStore1', batch: true})
    const store2 = new AppStore({name: 'AppStore2', batch: true})

    store1.connect(sessionActions, handlers)
    store2.connect(sessionActions, handlers)

    let onChangeCalled = 0

    function onChange(state) {
      onChangeCalled++
    }

    store1.listen(onChange)
    store2.listen(onChange)

    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)
    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)
    sessionActions.increaseStateByPromise(1)
    sessionActions.increaseState(1)

    sessionActions.increaseStateByPromise(1, {shouldReject: true})


    setTimeout(function () {
      assert.equal(store1.getState().value, 6)
      assert.equal(store2.getState().value, 6)

      // make sure that anything else isn't attached to state
      assert.equal(Object.keys(store1.getState()).length, 1)
      assert.equal(Object.keys(store2.getState()).length, 1)

      assert.equal(onChangeCalled, 4)

      done()
    }, 100)

  })

  it('can call method on a store Interface', function (done) {

    class AppStore extends EBus.Store {
      static model = StoreModel

      increaseStateDirectMethod(increaseValue) {
        this.value += increaseValue
        this.emitChange()
      }
    }

    const store1 = new AppStore()

    let onChange1Called = 0

    function onChange1(state) {
      onChange1Called++
    }

    store1.listen(onChange1)

    store1.increaseStateDirectMethod(1)
    store1.increaseStateDirectMethod(1)
    store1.increaseStateDirectMethod(1)

    assert.equal(store1.getState().value, 3)

    // make sure that anything else isn't attached to state
    assert.equal(Object.keys(store1.getState()).length, 1)

    assert.equal(onChange1Called, 4)


    done()

  })


})



