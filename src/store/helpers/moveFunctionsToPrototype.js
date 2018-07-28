'use strict'

function moveFunctionsToPrototype(storeConfig, coreModel, instance) {
  Object.keys(instance).forEach(key => {

    if (typeof instance[key] === 'function') {

      if (coreModel.prototype[key]) {
        throw new Error(`Store: ${storeConfig.name} trying to overwrite existing method: ${key}`)
      } else {
        coreModel.prototype[key] = instance[key]
      }

      delete instance[key]

    }

  })

}

export default moveFunctionsToPrototype