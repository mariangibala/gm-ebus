'use strict'

import connectMiddleware from './middleware/connect'
import middlewareLevels from './middleware/levels'

function connectActions(storeConfig, coreStore, instance, actionsEmitter, actionsHandlers) {
  
  const {namespace} = actionsEmitter
  const coreStorePrototype = coreStore.prototype

  if (!coreStorePrototype.handlers[namespace]) {
    coreStorePrototype.handlers[namespace] = {}
  }

  connectMiddleware(storeConfig, coreStorePrototype.handlers[namespace], instance, [
    {proto: actionsHandlers, name: 'Handlers', level: middlewareLevels.ACTION_HANDLERS},
  ])


  actionsEmitter.addListener(instance)
}

export default connectActions