'use strict'

class Store {
  constructor(EBus, config){
    EBus.connectStore(this, config)
  }
}

export default Store