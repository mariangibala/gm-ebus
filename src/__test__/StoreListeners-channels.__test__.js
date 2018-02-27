'use strict'

import {EventsBus} from '../index'

describe('Store listeners - channels', () => {

  let EBus

  beforeEach(function () {
    EBus = EventsBus()
  })

  it('channel listeners are separated from "global" listeners', function (done) {

    let calledA = 0
    let calledB = 0

    class AppStore extends EBus.Store {}
    const store = new AppStore()

    store.listen(function () {
      calledA++
    })

    store.listenChannel('channelName', function () {
      calledB++
    })

    assert.equal(calledA, 1)
    assert.equal(calledB, 1)

    store.emitChange()

    assert.equal(calledA, 2)
    assert.equal(calledB, 1)

    store.emitChange('channelName')

    assert.equal(calledA, 2)
    assert.equal(calledB, 2)

    done()
  })


})



