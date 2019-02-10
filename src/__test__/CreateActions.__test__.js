'use strict'

import { EventsBus, Actions, Store } from '../index'

describe('Actions - create', () => {
  let EBus

  beforeEach(function() {
    EBus = EventsBus()
  })

  ////////////////////

  it('uses id as namespace', function(done) {
    class AppActions extends Actions {
      static id = 'CustomID'
    }

    const actions = new AppActions(EBus)
    assert.exists(EBus.internals.actions.CustomID)

    done()
  })

  ////////////////////

  it('uses class name as namespace', function(done) {
    class CustomNameActions extends Actions {}

    const actions = new CustomNameActions(EBus)
    assert.exists(EBus.internals.actions.CustomNameActions)

    done()
  })

  ////////////////////

  it('uses namespace option', function(done) {
    class AppActions extends Actions {}

    const actions = new AppActions(EBus, { namespace: 'CustomNamespace' })
    assert.exists(EBus.internals.actions.CustomNamespace)

    done()
  })
})
