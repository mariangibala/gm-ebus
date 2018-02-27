'use strict'

/*
API mock
 */

const API = {
  a: 1,
  b: 1,
  c: 1,

  '/a'() {
    this.a += 1
    return this.a
  },

  '/b'() {
    this.b += 1
    return this.b
  }
}

/*
In real app it would be some http module like superagent
 */
function doRequest(endpoint) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(API[endpoint]())
    }, 50)
  })
}

export default doRequest