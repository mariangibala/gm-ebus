'use strict'

import connectMiddleware from './middleware/connect'
import middlewareLevels from './middleware/levels'

function connectActions(
  storeConfig,
  coreStore,
  instance,
  actionsEmitter,
  actionsHandlers,
) {
  let handlers
  if (typeof actionsHandlers === 'object') {
    handlers = actionsHandlers
  } else if (typeof actionsHandlers === 'function') {
    handlers = actionsHandlers.prototype
  } else {
    console.error(`actionsHandlers expected to be an object or a class`)
    return
  }

  const { namespace } = actionsEmitter
  const coreStorePrototype = coreStore.prototype

  if (!coreStorePrototype.handlers[namespace]) {
    coreStorePrototype.handlers[namespace] = {}
  }

  connectMiddleware(
    storeConfig,
    coreStorePrototype.handlers[namespace],
    instance,
    [
      {
        proto: handlers,
        name: 'Handlers',
        level: middlewareLevels.ACTION_HANDLERS,
      },
    ],
  )

  actionsEmitter.addListener(instance)
}

export default connectActions
