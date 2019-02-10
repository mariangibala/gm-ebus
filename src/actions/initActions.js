'use strict'

import normalizeOptions from '../utils/normalizeOptions'
import createActions from './actionsConstructor'

function initActions(EBusAPI, actionsModel, actionsOptions = {}) {
  actionsOptions = normalizeOptions(actionsOptions)

  let modelName = actionsModel.constructor.id || actionsModel.constructor.name

  /*
   Production configs usually minimize class names,
   so ignore class name prop in production to avoid name conflicts
  */
  if (process.env.NODE_ENV === 'production') {
    modelName = undefined
  }

  actionsOptions.namespace =
    actionsOptions.namespace ||
    modelName ||
    EBusAPI.generateActionsNamespace('AppActions')

  const { namespace } = actionsOptions

  if (!namespace) {
    throw new Error('Actions namespace is undefined')
  }

  if (EBusAPI.isActionsNamespaceAvailable(namespace) === false) {
    throw new Error(`Actions with namespace ${namespace} already exists`)
  }

  if (!actionsModel) {
    throw new Error(`Actions ${namespace} model is undefined`)
  }

  const actions = createActions(
    actionsModel,
    { ...EBusAPI.getConfig, ...actionsOptions },
    EBusAPI,
  )

  EBusAPI.addActions(namespace, actions)
}

export default initActions
