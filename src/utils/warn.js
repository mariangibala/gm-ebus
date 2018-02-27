'use strict'

function warn(id, warningsMap, message) {
  if (warningsMap.has(id)) {
    warningsMap.set(id, warningsMap.get(id) + 1)
    return
  }

  warningsMap.set(id, 1)
  console.warn(message)
}

export default warn
