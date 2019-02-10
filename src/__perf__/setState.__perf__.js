'use strict'

import { EventsBus, Store } from '../index'

function benchmark(config) {
  return new Promise((resolve, reject) => {
    const iterations = 10000
    const EBus = new EventsBus()

    class AppStore extends Store {
      static model = class {
        value = 0
        arr = []
      }

      increaseState(val) {
        this.value = this.value + val
        this.arr.push(val)
        this.emitChange()
      }
    }

    const store = new AppStore(EBus, config)

    const logConfig = { ...config }
    delete logConfig.name
    console.log(JSON.stringify(logConfig, null, 2))
    console.time('')

    let componentState = 0

    store.listen(function(storeState) {
      componentState = storeState.value
    })

    for (let x = 0; x < iterations; x++) {
      store.increaseState(1)
    }

    setTimeout(() => {
      if (componentState !== iterations) {
        throw new Error('State is incorrect')
      }

      console.timeEnd('')
      resolve()
    }, 50)
  })
}

async function init() {
  await benchmark({ getStateMethod: 'direct' })
  await benchmark({ getStateMethod: 'assign' })
  await benchmark({ getStateMethod: 'stringify' })

  await benchmark({ getStateMethod: 'direct', batch: true })
  await benchmark({ getStateMethod: 'assign', batch: true })
  await benchmark({ getStateMethod: 'stringify', batch: true })
}

describe('setState', () => {
  it('getStateMethod 10000 store actions', function(done) {
    this.timeout(10000)

    init().then(() => {
      done()
    })
  })
})
