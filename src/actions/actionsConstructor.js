'use strict'

import getOwnProps from '../utils/getOwnPropeties'

function createActions(instance, options_, EBusApi) {
  const model = instance.__proto__

  const options = {
    ...options_,
  }

  instance.namespace = options.namespace

  if (options.inject) {
    options.inject.forEach((el) => {
      if (!el.constructor.id) {
        throw new Error(
          `Can't inject actions (${el.constructor.name} - ${el.namespace}) ` +
            `without an ID to ${instance.constructor.name} - ${
              instance.namespace
            }`,
        )
      }

      instance['$' + el.constructor.id] = el
    })
  }

  instance.listeners = []

  instance.addListener = function(listener) {
    this.listeners.push(listener)
  }

  instance.emitAction = function(actionName, data) {
    EBusApi.emitAction(this.namespace, actionName, data)
  }

  instance.__emitAction = function(actionName, data) {
    this.listeners.forEach((store) =>
      store.__emitAction(this.namespace, actionName, data),
    )
  }

  const actions = instance

  getOwnProps(model).forEach((actionName) => {
    const shouldBindPromise = model[actionName].bindPromise === true

    let successFunc

    if (shouldBindPromise) {
      successFunc = actionName + 'Success'

      actions[successFunc] = function(result) {
        if (typeof result !== 'undefined') {
          actions.emitAction(successFunc, result)
        }
      }
    }

    let callAction

    if (shouldBindPromise) {
      callAction = function(...args) {
        model[actionName]
          .apply(actions, args)
          .then((result) => {
            actions[successFunc].call(null, result)
          })
          .catch((err) => {
            // make possible to register err handler
            // (like superagent?)
            //console.error(err)
          })
      }
    } else {
      callAction = function(...args) {
        const result = model[actionName].apply(actions, args)

        if (typeof result !== 'undefined') {
          actions.emitAction(actionName, result)
        }
      }
    }

    actions[actionName] = callAction
    actions[actionName].defer = (...args) =>
      setTimeout(() => callAction(...args))
  })

  return actions
}

export default createActions
