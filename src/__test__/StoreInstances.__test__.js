'use strict'

import {EventsBus}  from '../index'
import Model from './shared/Model'

describe('Store Instance', () => {

  let EBus
  let StoreModel 

  beforeEach(function () {
    EBus = EventsBus()
  })

  it('correct for 1 model, 2 stores', function (done) {

    class AppStore extends EBus.Store {
      static model = StoreModel
      static autoNames = true
    }


    const store1 = new AppStore()
    const store2 = new AppStore()

    store1.set('value', 2)
    store2.set('value', 3)

    assert.equal(store1.getState().value, 2)
    assert.equal(store2.getState().value, 3)

    done()

  })


  it('correct for 1 model, 2 Stores, core method', function (done) {

    class AppStore extends EBus.Store {
      static model = Model
    }

    class AppStore2 extends EBus.Store {
      static model = Model
    }

    const store1 = new AppStore()
    const store2 = new AppStore2()

    store1.set('value', 2)
    store2.set('value', 3)

    assert.equal(store1.getState().value, 2)
    assert.equal(store2.getState().value, 3)

    done()

  })

  it('correct for 1 model, 2 Interfaces, 2 stores, interface()->store() method', function (done) {

    class AppStore extends EBus.Store {
      static model = Model

      methodB(x){
        this.storeModelMethod(x)
      }
    }


    class AppStore2 extends EBus.Store {
      static model = Model

      methodB(x){
        this.storeModelMethod(x)
      }
    }

    const store1 = new AppStore()
    const store2 = new AppStore2()

    store1.methodB(2)
    store2.methodB(3)

    assert.equal(store1.getState().value, 2)
    assert.equal(store2.getState().value, 3)

    done()

  })

})



