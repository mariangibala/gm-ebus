'use strict'

/*
Used to decorate StoreModel with emitChange function
 */

function includeEmitChange(storeConfig, internals) {

  function emitChange(changeId) {
    const currentState = this.getState()

    let listeners
    if (changeId) {
      if (internals.channelListeners[changeId]) {
        listeners = internals.channelListeners[changeId]
      } else {
        return
      }
    } else {
      listeners = internals.listeners
    }

    listeners.forEach((value, key) => {
      try {
        key(currentState)
      } catch (err) {
        console.error(err)
      }
    })
  }

  if (storeConfig.batch) {

    const batchTime = 30 // how long cumulate batch events?

    return function (changeId) {
      if (internals.lastChangeTime && (Date.now() - internals.lastChangeTime) < batchTime) return

      internals.lastChangeTime = Date.now()

      internals.changeTimeout = setTimeout(() => {
        emitChange.call(this, changeId)
      }, batchTime)
    }

  } else {
    return emitChange
  }

}

export default includeEmitChange


