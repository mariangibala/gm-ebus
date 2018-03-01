'use strict'

import {EventsBus, Store}  from '../index'

class CustomAppStore {}


describe('CreateStore - naming', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('creates stores with correct names', function (done) {

    class AppStore extends Store {}

    new AppStore(EBus)
    new AppStore(EBus, 'Store2')
    new AppStore(EBus, {name: 'Store3'})

    assert.isDefined(EBus.internals.stores.AppStore)
    assert.isDefined(EBus.internals.stores.Store2)
    assert.isDefined(EBus.internals.stores.Store3)

    done()
  })


  it('throws err when name is already taken', function (done) {

    class AppStore extends Store {}
    new AppStore(EBus)

    try {
      new AppStore(EBus)
    } catch (err) {
      expect(err).to.be.a('Error')
    }

    done()
  })


  it('Creates model and names automatically when model is not passed', function (done) {

    class AppStore extends Store {
      static autoNames = true
    }

    new AppStore(EBus)
    new AppStore(EBus)
    new AppStore(EBus)

    assert.isDefined(EBus.internals.stores.AppStore1)
    assert.isDefined(EBus.internals.stores.AppStore2)
    assert.isDefined(EBus.internals.stores.AppStore3)

    done()
  })


})



