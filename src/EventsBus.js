'use strict'

import initStore from './store/initStore'
import initActions from './actions/initActions'

const packageJSON = require('../package.json')

function EBusConstructor(eventsBusConfig) {
  const internals = {}

  Object.defineProperties(internals, {
    config: {
      enumerable: true,
      value: {
        debug: false,
        actionsErrorHandler: function(err) {
          console.error(err)
        },
        ...eventsBusConfig,
      },
    },

    stores: {
      enumerable: true,
      value: {},
    },

    interfaces: {
      enumerable: true,
      value: {},
    },

    actions: {
      enumerable: true,
      value: {},
    },

    // It's incremental id counter, not a number of stores/actions.
    storesIdCounter: {
      enumerable: true,
      value: 0,
      writable: true,
    },

    actionsIdCounter: {
      enumerable: true,
      value: 0,
      writable: true,
    },

    isDispatching: {
      enumerable: true,
      value: false,
      writable: true,
    },
  })

  const internalAPI = {
    generateStoreName(prefix) {
      internals.storesIdCounter++
      return prefix + internals.storesIdCounter
    },

    generateActionsNamespace(prefix) {
      internals.actionsIdCounter++
      return prefix + internals.actionsIdCounter
    },

    isStoreNameAvailable(name) {
      return internals.stores[name] ? false : true
    },

    isActionsNamespaceAvailable(namespace) {
      return internals.actions[namespace] ? false : true
    },

    addStore(name, store) {
      internals.stores[name] = store
    },

    exposeInterface(name, storeInterface) {
      internals.interfaces[name] = storeInterface
    },

    addActions(namespace, actionsInstance) {
      internals.actions[namespace] = actionsInstance
    },

    getConfig() {
      return internals.config
    },

    emitAction(namespace, actionName, data) {
      if (internals.config.debug && internals.config.debug.isActive) {
        console.log('EBus emitAction: ', namespace, actionName)
      }

      if (internals.isDispatching) {
        throw 'Cannot dispatch in the middle of dispatching.'
      }

      internals.isDispatching = true

      try {
        internals.actions[namespace].__emitAction(actionName, data)
      } catch (err) {
        /*
         Errors here are thrown by action handlers.
         Initially logged only in debug mode but it hides all errors thrown in action handlers.
         You are literally blind then - so keep it independent from debug mode!
         */

        console.error(err) // throw it or log?
      } finally {
        internals.isDispatching = false
      }
    },
  }

  class EventsBus {
    constructor() {
      this.version = packageJSON.version
    }

    serialize() {
      const globalState = {}

      Object.keys(internals.stores).forEach((el) => {
        globalState[el] = internals.stores[el].getState()
      })

      let result

      try {
        result = JSON.stringify(globalState, null, 2)
      } catch (err) {
        console.error(err)
      }
      return result
    }
  }

  // todo if DEV
  EventsBus.prototype.emitAction = internalAPI.emitAction
  EventsBus.prototype.internals = internals

  const EBus = new EventsBus()

  function connectActions(instance, config) {
    initActions(internalAPI, ...arguments)
  }

  function connectStore(instance, config) {
    initStore(internalAPI, ...arguments)
  }

  return {
    EventsBus: EBus,
    internals,
    connectActions,
    connectStore,
  }
}

export default EBusConstructor
