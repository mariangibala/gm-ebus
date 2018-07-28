'use strict'

class Store {
  constructor(EBus, config){
    if (!EBus){
      throw new Error('Store requires EventBus as an argument.')
    }
    EBus.connectStore(this, config)
  }
}

export default Store