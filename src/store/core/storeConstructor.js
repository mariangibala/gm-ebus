'use strict'

import decorateWithGetState from './decorators/getState'
import decorateWithEmitChange from './decorators/emitChange'
import connectActions from './connectActions'
import validateModel from './helpers/validateModel'
import moveFunctionsToPrototype from './helpers/moveFunctionsToPrototype'

import connectMiddleware from './middleware/connect'
import middlewareLevels from './middleware/levels'

import warn from '../../utils/warn'

function createStore(model, storeInterface, passedStoreConfig) {

  const storeConfig = {
    debug: {
      isActive: false
    },
    batch: false,
    maxListeners: 100,
    getStateMethod: 'assign',
    name: undefined,
    middleware: [],
    ...passedStoreConfig
  }

  const internals = {
    listeners: new Map(),
    channelListeners: Object.create(null),
    lastChangeTime: undefined,
    changeTimeout: undefined,

    /* Status flag used when store is initialized to queue called but non available yet methods */
    isMounted: false,

    /* Log placeholder for warnings (some of them should be thrown only once) */
    warnings: new Map()
  }

  let actionsToBind = []

  // Normalize
  if (typeof storeConfig.debug !== 'object') {
    let status = storeConfig.debug
    storeConfig.debug = {
      isActive: status
    }
  }


  if (storeConfig.debug.isActive !== false) {
    console.log('Initialized store: ', JSON.stringify(storeConfig, null, 2))
  }


  class Store extends model {
    constructor() {
      super()

      moveFunctionsToPrototype(storeConfig, Store, this)

      connectMiddleware(storeConfig, Store.prototype, this, [
        {proto: Store.prototype, name: 'Core', level: middlewareLevels.CORE},
        {proto: model.prototype, name: 'Store model', level: middlewareLevels.STORE},
      ])

      if (actionsToBind.length) {
        actionsToBind.forEach(actionsDataArr => connectActions(storeConfig, Store, this, ...actionsDataArr))
        actionsToBind = null
      }

      if (model.connect) {
        model.connect.forEach(el => {
          connectActions(storeConfig, Store, this, el[0], el[1].prototype)
        })
      }

      internals.isMounted = true

    }


    connect(actions, handlers) {
      if (internals.isMounted) {
        connectActions(storeConfig, Store, this, actions, handlers)
      } else {
        actionsToBind.push([actions, handlers])
      }
    }

    set(prop, val, e) {

      /*
       Prevent propagation when action is called directly by event, lets say: onClick
       and el is nested in other el connected to a store too with own onClick handler
      */
      if (e && e.stopPropagation) e.stopPropagation()
      this[prop] = val
      this.emitChange()
    }

    getConfig() {
      return storeConfig
    }

    getListeners() {
      return internals.listeners
    }

    getChannelListeners() {
      return internals.channelListeners
    }

    listen(callback, options = {}) {

      const {name, init = true} = options

      if (internals.listeners.size > storeConfig.maxListeners) {
        warn('maxListeners', internals.warnings,
          `${storeConfig.name} reached maxListeners (${storeConfig.maxListeners})`)
      }

      if (typeof callback !== 'function') {
        throw new Error('Expected callback to be a function.')
      }

      internals.listeners.set(callback, name)
      if (init) callback(this.getState())

    }

    listenChannel(channelId, callback, options = {}) {

      const {name, init = true} = options

      if (!internals.channelListeners[channelId]) {
        internals.channelListeners[channelId] = new Map()
      } else if (internals.channelListeners[channelId].size > storeConfig.maxListeners) {
        warn('maxListeners-' + channelId, internals.warnings,
          `${storeConfig.name} reached maxListeners (${storeConfig.maxListeners}) for ${channelId} channel`)
      }

      if (typeof callback !== 'function') {
        throw new Error('Expected callback to be a function.')
      }

      internals.channelListeners[channelId].set(callback, name)
      if (init) callback(this.getState())
    }

    unlisten(callback) {
      internals.listeners.delete(callback)
    }

    unlistenChannel(channelId, callback) {
      internals.channelListeners[channelId].delete(callback)

      if (internals.channelListeners[channelId].size === 0) {
        delete internals.channelListeners[channelId]
      }
    }

    __emitAction(namespace, actionName, data) {
      if (this.handlers[namespace][actionName]) {
        const result = this.handlers[namespace][actionName](data)
        if (result !== false) this.emitChange()
      }
    }

    static getStoreName() {
      return storeConfig.name
    }

  }

  Store.prototype.handlers = {}
  Store.prototype.getState = decorateWithGetState(storeConfig)
  Store.prototype.emitChange = decorateWithEmitChange(storeConfig, internals)
  Store.prototype.internals = internals


  validateModel(storeConfig, model, Store)

  const store = new Store()

  connectMiddleware(storeConfig, storeInterface, store, [
    {proto: storeInterface.__proto__, name: 'Interface', level: middlewareLevels.INTERFACE}
  ], store)

  const expose = [
    'getState',
    'listen',
    'unlisten',
    'listenChannel',
    'unlistenChannel',
    'set',
    'connect',

    // todo hide in production
    'getListeners',
    'getChannelListeners',
    'getConfig',
    'emitChange'
  ]


  expose.forEach(key => {
    storeInterface[key] = store[key].bind(store)
  })


  return {store, storeInterface}
}


export default createStore