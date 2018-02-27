'use strict'

import getOwnProps from '../utils/getOwnPropeties'

function createActions(model, options_, EBusApi) {

  const options = {
    ...options_
  }

  class Actions extends model {
    constructor() {
      super()

      this.namespace = options.namespace
      this.listeners = []
    }

    addListener(listener) {
      this.listeners.push(listener)
    }

    emitAction(actionName, data) {
      EBusApi.emitAction(this.namespace, actionName, data)
    }

    __emitAction(actionName, data) {
      this.listeners.forEach(store => store.__emitAction(this.namespace, actionName, data))
    }
  }

  const actions = new Actions()

  getOwnProps(model.prototype).forEach(actionName => {

    const shouldBindPromise = model.prototype[actionName].bindPromise === true

    let successFunc

    if (shouldBindPromise) {

      successFunc = actionName + 'Success'

      actions[successFunc] = function (result) {
        if (typeof result !== 'undefined') {
          actions.emitAction(successFunc, result)
        }
      }
    }

    let callAction

    if (shouldBindPromise) {

      callAction = function (...args) {

        model.prototype[actionName].apply(actions, args)
          .then(result => {
            actions[successFunc].call(null, result)
          })
          .catch(err => {
            // make possible to register err handler
            // (like superagent?)
            //console.error(err)
          })
      }

    } else {
      callAction = function (...args) {
        const result = model.prototype[actionName].apply(actions, args)

        if (typeof result !== 'undefined') {
          actions.emitAction(actionName, result)
        }

      }
    }


    actions[actionName] = callAction
    actions[actionName].defer = (...args) => setTimeout(() => callAction(...args))
  })

  return actions
}


export default createActions