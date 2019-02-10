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
  },

  '/error'() {
    return { message: 'API Request Fake Error', isError: true }
  },
}

/**
 *
 * In a real app it would be some http module like superagent
 */
function doRequest(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = API[endpoint]()
      if (result.isError) {
        reject(result)
      } else {
        resolve()
      }
    }, 50)
  })
}

export default doRequest
