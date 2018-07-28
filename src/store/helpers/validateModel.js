'use strict'

import getOwnProps from '../../utils/getOwnPropeties'

function validateModel(storeConfig, StoreModel, CoreModel) {

  getOwnProps(StoreModel.prototype)
    .forEach(key => {
      if (CoreModel.prototype.hasOwnProperty(key)) {
        throw new Error(`Store: ${storeConfig.name} trying to overwrite existing method: ${key}`)
      }
    })
}

export default validateModel