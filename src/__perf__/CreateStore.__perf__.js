'use strict'

import { EventsBus, Store } from '../index'

describe('createStore', () => {
  it('time and memory', function(done) {
    this.timeout(10000)
    let startTime = Date.now()

    for (let x = 0; x < 100; x++) {
      let EBus = new EventsBus()

      class AppStore extends Store {
        static autoNames = true
      }

      let store

      for (let y = 0; y < 500; y++) {
        store = new AppStore(EBus)
      }
    }

    const time = Date.now() - startTime
    const used = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

    console.log(`Took ${time} ms`)
    console.log(`The script uses approximately ${used} MB`)
    done()
  })
})
