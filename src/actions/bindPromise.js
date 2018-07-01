'use strict'

function bindPromise(target, key, descriptor){
  let fn = descriptor.value

  if (process.env.NODE_ENV !== 'production'){

    if (typeof fn !== 'function') {
      throw new Error(`@bindPromise decorator can only be applied to methods not: ${typeof fn}`)
    }

    if (fn.toString().includes('return') === false){
      console.error('@bindPromise must return promise in: ', fn)
      throw new Error('Missing return statement')
    }
  }

  target[key].bindPromise = true
}

export default bindPromise