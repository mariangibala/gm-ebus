'use strict'

function bindPromise(target, key, descriptor){
  let fn = descriptor.value

  if (typeof fn !== 'function') {
    throw new Error(`@bindPromise decorator can only be applied to methods not: ${typeof fn}`)
  }

  target[key].bindPromise = true
}

export default bindPromise