'use strict'

import {EventsBus, Store} from '../index'
import doubleNumbers from './shared/doubleNumbers'
import Model from './shared/Model'


describe('Middleware - store instance', () => {

  let EBus
  let StoreModel

  beforeEach(function () {
    EBus = EventsBus()
    StoreModel = Model
  })

  /////////////////////////

  it('correct instance for 1 model, 2 stores, core method', function (done) {

    class AppStore extends Store {
      static model = StoreModel
      static autoNames = true
    }

    const store1 = new AppStore(EBus, {middleware: [doubleNumbers]})
    const store2 = new AppStore(EBus, {middleware: [doubleNumbers]})

    store1.set('value', 1)
    store2.set('value', 2)

    assert.equal(store1.getState().value, 2)
    assert.equal(store2.getState().value, 4)
    done()

  })


  /////////////////////////

  it('correct instance for: 1 model, 2 stores, 2 custom Interfaces, interface()->core() method',
    function (done) {


      class AppStore extends Store {
        static model = StoreModel

        methodA(x) {
          this.set('value', x)
        }
      }

      class AppStore2 extends Store {
        static model = StoreModel

        methodA(x) {
          this.set('value', x)
        }
      }


      const store1 = new AppStore(EBus, {middleware: [doubleNumbers]})
      const store2 = new AppStore2(EBus, {middleware: [doubleNumbers]})

      store1.methodA(1)
      store2.methodA(2)

      assert.equal(store1.getState().value, 4)
      assert.equal(store2.getState().value, 8)
      done()

    })


})



