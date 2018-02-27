'use strict'

const defaultConfig = {
  clearConsole: false,
  logFuncInArgs: false            // log function or just (f)
}

// Some shared module "globals"

let lastLog = Date.now()

const colors = ['crimson', 'blueviolet', 'darkred', 'royalblue', 'limegreen', 'coral',
  'deeppink', 'lightseagreen', 'brown', 'orange']

let colorsQueue = colors.slice()
const colorsMap = {}


function debugMiddlewareHandler(methodConfig, args) {

  const {
    logFuncInArgs,
    config,
    log
  } = methodConfig

  let logArgs

  if (args && args.length) {

    logArgs = []

    try {
      args.forEach((el, index) => {
        if (typeof el === 'function') {
          // stringify will create null for functions, so check func and mark it
          logArgs[index] = '(f)'

          if (logFuncInArgs) console.log(el)

        } else {
          logArgs[index] = el
        }
      })

      logArgs = JSON.stringify(logArgs, null, 2)
    } catch (err) {
      console.error(err)
      logArgs = args
    }
  }


  if (config.clearConsole) {
    if (Date.now() - lastLog > 6000) {
      console.clear()
    }
  }

  if (Date.now() - lastLog > 1000) {
    console.log('\n\n\n')
    lastLog = Date.now()
  }

  const finalLog = [...log]

  if (logArgs) {
    finalLog.push(logArgs)
  }

  /*
 Interesting thing here, all browsers work correctly when null is passed as "this" argument -
 except Edge, which renders app correctly when dev console is open, otherwise...
 crashes app silently and renders blank page. Console isn't JS standardized object,
 and implementations differ.
 Consider implementing preInit func for middleware to do env checks.
  */
  console.log.apply(console, finalLog)

  return args
}


function getColor(storeName) {
  if (colorsMap[storeName]) return colorsMap[storeName]

  if (colorsQueue.length === 0) {
    colorsQueue = colors.slice()
  }

  colorsMap[storeName] = colorsQueue.shift()

  return colorsMap[storeName]
}


function connect(storeConfig, methodName, middlewareConfig) {
  const {name} = storeConfig

  let config
  if (typeof debug === 'object') {
    config = {...defaultConfig, ...middlewareConfig}
  } else {
    config = {...defaultConfig}
  }

  console.log(`${name} debugger connected to ${methodName}`)

  const color = getColor(name)

  let log
  if (typeof window === 'undefined' || /Edge/.test(window.navigator.userAgent)) {
    log = [`${name} ${methodName}`]
  } else {
    log = [`%c${name} ${methodName}`, `color: ${color};`]
  }

  return debugMiddlewareHandler.bind(null, {
    log,
    config,
    logFuncInArgs: false
  }, /*args*/)

}


export default connect