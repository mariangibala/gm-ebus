'use strict'

import shouldConnect from '../shouldConnect'
import levels from '../levels'

describe('Middleware - unit - shouldConnect', () => {
  it('returns correct result for valid config variations', function(done) {
    assert.equal(shouldConnect({}, 'getState', levels.CORE), true)

    assert.equal(
      shouldConnect({ isActive: false }, 'getState', levels.CORE),
      false,
    )

    assert.equal(
      shouldConnect({ isActive: true }, 'getState', levels.CORE),
      true,
    )

    done()
  })

  it('excludes correctly method', function(done) {
    assert.equal(
      shouldConnect({ exclude: ['getState'] }, 'getState', levels.CORE),
      false,
    )

    assert.equal(
      shouldConnect({ exclude: ['getState'] }, 'otherMethod', levels.CORE),
      true,
    )

    done()
  })

  it('includes correctly method when "only" is used', function(done) {
    assert.equal(
      shouldConnect({ only: ['getState'] }, 'getState', levels.CORE),
      true,
    )

    assert.equal(
      shouldConnect({ only: ['getState'] }, 'otherMethod', levels.CORE),
      false,
    )

    done()
  })

  it('excludes correctly method by "excludeLevel"', function(done) {
    assert.equal(
      shouldConnect({ excludeLevel: [levels.CORE] }, 'getState', levels.CORE),
      false,
    )

    assert.equal(
      shouldConnect(
        { excludeLevel: [levels.CORE] },
        'otherMethod',
        levels.STORE,
      ),
      true,
    )

    done()
  })

  it('includes correctly method when "onlyLevel" is used', function(done) {
    assert.equal(
      shouldConnect(
        { onlyLevel: [levels.ACTION_HANDLERS] },
        'someAction',
        levels.ACTION_HANDLERS,
      ),
      true,
    )

    assert.equal(
      shouldConnect(
        { onlyLevel: [levels.ACTION_HANDLERS] },
        'otherMethod',
        levels.STORE,
      ),
      false,
    )

    done()
  })
})
