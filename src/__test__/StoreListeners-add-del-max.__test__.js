'use strict'

import { EventsBus, Store } from '../index'
const sinon = require('sinon')

describe('Store listeners - add, del, max', () => {
  let EBus

  beforeEach(function() {
    EBus = EventsBus()
  })

  it('warns user when listeners > default maxListeners', function(done) {
    sinon.stub(console, 'warn').callsFake(() => {})

    class AppStore extends Store {}
    const store = new AppStore(EBus)

    let x = 102

    while (x) {
      store.listen(() => {})
      x--
    }

    assert.equal(console.warn.callCount, 1)
    console.warn.restore()
    done()
  })

  it('warns user when listeners > defined maxListeners', function(done) {
    sinon.stub(console, 'warn').callsFake(() => {})

    class AppStore extends Store {}
    const store = new AppStore(EBus, { maxListeners: 20 })

    let x = 22

    while (x) {
      store.listen(() => {})
      x--
    }

    assert.equal(console.warn.callCount, 1)
    console.warn.restore()
    done()
  })

  it('adds/removes listeners', function(done) {
    class AppStore extends Store {}
    const store = new AppStore(EBus)

    let listeners = store.getListeners()

    assert.equal(listeners.size, 0)

    const functions = []

    for (let x = 0; x < 3; x++) {
      functions[x] = () => {}
      store.listen(functions[x])
    }

    listeners = store.getListeners()
    assert.equal(listeners.size, 3)

    functions.forEach((func) => store.unlisten(func))
    assert.equal(listeners.size, 0)

    done()
  })

  it('adds/removes channel listeners', function(done) {
    class AppStore extends Store {}
    const store = new AppStore(EBus)

    let listeners = store.getChannelListeners()

    assert.equal(Object.keys(listeners).length, 0)

    const functions = []

    for (let x = 0; x < 3; x++) {
      functions[x] = () => {}
      store.listenChannel(x, functions[x])
    }

    listeners = store.getChannelListeners()
    assert.equal(Object.keys(listeners).length, 3)

    functions.forEach((func, i) => store.unlistenChannel(i, func))
    assert.equal(Object.keys(listeners).length, 0)

    done()
  })

  it('uses console.error for error in listener', function(done) {
    sinon.stub(console, 'error').callsFake(() => {})

    class AppStore extends Store {}
    const store = new AppStore(EBus)

    let someExternalData = {
      value: 0,
    }

    function onChange() {
      someExternalData.value++
    }

    store.listen(onChange)

    store.emitChange()

    someExternalData = null

    store.emitChange()

    assert.equal(console.error.callCount, 1)
    console.error.restore()

    done()
  })
})
