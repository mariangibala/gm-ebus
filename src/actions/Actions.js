'use strict'

class Actions {
  constructor(EBus, config){
    EBus.connectActions(this, config)
  }
}

export default Actions