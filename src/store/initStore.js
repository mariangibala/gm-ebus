'use strict'

import normalizeOptions from '../utils/normalizeOptions'
import createStore from './core/storeConstructor'


function isStoreConfig(a) {
  return (typeof a === 'object' || typeof a === 'string') ? true : false
}


function initStore(EBusAPI, storeInterface, config) {
  const constructor = storeInterface.__proto__.constructor

  let useDefaultStoreModel
  let storeConfig = {}
  let storeModel = constructor.model

  if (config && isStoreConfig(config)) {
    storeConfig = config
  }

  if (!storeModel) {
    storeModel = {}
    useDefaultStoreModel = true
  }

  storeConfig = normalizeOptions(storeConfig)

  /*
   Production configs usually minimize class names,
   so switch here to autoNames=true to avoid name conflicts
  */
  let autoNames

  if (process.env.NODE_ENV === 'production'){
    autoNames = true
  }

  if (!storeConfig.name){
    if (constructor.autoNames || autoNames) {
      storeConfig.name = EBusAPI.generateStoreName('AppStore')
    } else {
      storeConfig.name = constructor.name
    }
  }

  const {name} = storeConfig

  if (!name){
    throw new Error(`Store name cannot be undefined`)
  }

  if (EBusAPI.isStoreNameAvailable(name) === false) {
    throw new Error(`Store with a name ${name} already exists`)
  }

  // important order here to avoid 'AppStore.name' from default class being used
  if (useDefaultStoreModel) {
    storeModel = class AppStore {}
  }

  const storeInstance = createStore(storeModel, storeInterface,
    {...EBusAPI.getConfig(), ...storeConfig})

  EBusAPI.addStore(name, storeInstance.store)
  EBusAPI.exposeInterface(name, storeInstance.storeInterface)

}

export default initStore