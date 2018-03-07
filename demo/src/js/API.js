'use strict'

/**
 * API mock
 */

const API = {
  foo: 1,
  bar: 1,

  '/foo'() {
    this.foo += 1
    return this.foo
  },

  '/bar'() {
    this.bar += 1
    return this.bar
  }
}

/**
 *
 * In a real app it would be some http module like superagent
 */
function doRequest(endpoint) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(API[endpoint]())
    }, 50)
  })
}

export default doRequest