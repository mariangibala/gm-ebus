'use strict'

import { EventsBus, Store } from '../index'

describe('Store Interface', () => {
  let EBus

  beforeEach(function() {
    EBus = EventsBus()
  })

  it("doesn't expose private native methods", function(done) {
    class AppStore extends Store {}
    const store = new AppStore(EBus)

    try {
      store.__emitAction()
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }
  })

  it("doesn't expose private userModel methods", function(done) {
    class AppStore extends Store {
      static model = class {
        someMethod() {}
      }
    }

    const store = new AppStore(EBus)

    try {
      store.someMethod()
    } catch (err) {
      expect(err).to.be.an('error')
      done()
    }
  })

  it('exposes public Interface methods', function(done) {
    class AppStore extends Store {
      someMethod() {}
    }

    const store = new AppStore(EBus)
    store.someMethod()

    done()
  })
})
