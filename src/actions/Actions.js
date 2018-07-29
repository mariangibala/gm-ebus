'use strict'

class Actions {
  constructor(EBus, config){
    if (!EBus){
      throw new Error('Actions constructor requires EventBus as an argument.')
    }
    EBus.connectActions(this, config)
  }
}

export default Actions