'use strict'

import {EventsBus} from '../index'

let startTime = Date.now()

for (let x = 0; x < 100; x++) {
  let EBus = EventsBus()

  class AppStore extends EBus.Store {
    static autoNames = true
  }

  let store

  for (let y = 0; y < 500; y++) {
    store = new AppStore()
  }
}

const time = Date.now() - startTime
const used = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

console.log(`Took ${time} ms`)
console.log(`The script uses approximately ${used} MB`)

