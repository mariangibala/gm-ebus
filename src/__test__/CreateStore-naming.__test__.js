'use strict'

import {EventsBus}  from '../index'

class CustomAppStore {}


describe('CreateStore - naming', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })


  it('creates stores with correct names', function (done) {

    class AppStore extends EBus.Store {
      constructor(x){
        super(x)
      }
    }

    new AppStore()
    new AppStore('Store2')
    new AppStore({name: 'Store3'})

    assert.isDefined(EBus.internals.stores.AppStore)
    assert.isDefined(EBus.internals.stores.Store2)
    assert.isDefined(EBus.internals.stores.Store3)

    done()
  })


  it('throws err when name is already taken', function (done) {

    class AppStore extends EBus.Store {}
    new AppStore()

    try {
      new AppStore()
    } catch (err) {
      expect(err).to.be.a('Error')
    }

    done()
  })


  it('Creates model and names automatically when model is not passed', function (done) {

    class AppStore extends EBus.Store {
      static autoNames = true
    }

    new AppStore()
    new AppStore()
    new AppStore()

    assert.isDefined(EBus.internals.stores.AppStore1)
    assert.isDefined(EBus.internals.stores.AppStore2)
    assert.isDefined(EBus.internals.stores.AppStore3)

    done()
  })


})



