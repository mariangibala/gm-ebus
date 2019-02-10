'use strict'

/*
 Used to decorate storeModel with a selected getState method
*/
const getStateMethods = {
  stringify: function() {
    let state
    try {
      state = JSON.parse(JSON.stringify(this))
    } catch (err) {
      console.error(err)
    }
    return state
  },
  direct: function() {
    return this
  },
  assign: function() {
    return { ...this }
  },
}

function includeGetState(storeConfig) {
  return getStateMethods[storeConfig.getStateMethod]
}

export default includeGetState
