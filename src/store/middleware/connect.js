'use strict'

import debug from './default/debug'
import shouldConnect from './shouldConnect'
import getOwnProps from '../../utils/getOwnPropeties'

const defaultMiddleware = {
  debug: debug,
}

function applyMiddleware(
  storeConfig,
  targetPrototype,
  instance,
  sources,
  funcSrc,
) {
  let middlewareList
  if (storeConfig.middleware) {
    middlewareList = [...storeConfig.middleware]
  } else {
    middlewareList = []
  }

  if (storeConfig.debug.isActive) {
    middlewareList.push({ ...storeConfig.debug, connect: debug })
  }

  function bindMethod(proto, key, levelType) {
    if (typeof proto[key] !== 'function') {
      return
    }

    /*
      Save memory reference to original function, to prevent garbage collecting it
      and to use as a ref later when we edit original proto[key]
    */

    let originalFunc

    if (funcSrc && funcSrc[key]) {
      // just use as a proxy to core func
      targetPrototype[key] = funcSrc[key]
      return
    } else {
      originalFunc = proto[key]
    }

    /*
      We don't want to modify storeModel prototype (it may be used for many stores),
      so point where to save modified functions (probably coreModel which is unique for each store)
    */

    let target
    if (targetPrototype) {
      target = targetPrototype
    } else {
      target = proto
    }

    const middleware = middlewareList
      .map((middleware) => {
        // We accept a few formats here, so lets normalize.

        let middlewareConfig = {}

        if (typeof middleware === 'function') {
          middlewareConfig.connect = middleware
        } else if (typeof middleware === 'object' && middleware.connect) {
          middlewareConfig = { ...middleware }

          if (
            typeof middleware.connect === 'string' &&
            defaultMiddleware[middleware.connect]
          ) {
            middlewareConfig.connect = defaultMiddleware[middleware.connect]
          }
        }

        if (
          !middlewareConfig.connect ||
          typeof middlewareConfig.connect !== 'function'
        ) {
          console.error('Unrecognized middleware: ', middleware)
          return
        }

        if (shouldConnect(middlewareConfig, key, levelType) === false) {
          return
        }

        const connectArgs = [storeConfig, key, middleware.config || {}]
        return middlewareConfig.connect.apply(null, connectArgs)
      })
      .filter((result) => {
        /*
         Middleware may implement internal check shouldConnect.
         If it want to be connected it's supposed to return function.
        */
        if (typeof result === 'function') return result
      })

    /*
    Binding! If there is any middleware to connect for current method
    Create higher order function, to wrap targeted method into middleware support
    */
    if (middleware.length) {
      target[key] = function(...args) {
        const _args = middleware.reduce((args, func) => {
          return func(args)
        }, args)

        // and here is our original func, where after middleware "loop"
        // we finally pass our data
        return originalFunc.call(instance, ..._args)
      }
    } else {
      target[key] = originalFunc.bind(instance)
    }
  }

  sources.forEach((config) => {
    const { proto, name, type } = config

    if (!proto) return

    if (storeConfig.debug.isActive) {
      console.log(storeConfig.name, ' Wrapping middleware to: ', name)
    }

    getOwnProps(proto).forEach((key) => bindMethod(proto, key, type))
  })
}

export default applyMiddleware
