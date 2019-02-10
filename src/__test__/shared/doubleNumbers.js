'use strict'

/*
Simple middleware function which doubles numbers in passed arguments
 */
function doubleNumbers(storeConfig, methodName, middlewareConfig) {
  return function(args) {
    args = args.map((el) => {
      if (Number.isNaN(parseInt(el)) === false) {
        return el * 2
      } else {
        return el
      }
    })
    return args
  }
}

export default doubleNumbers
