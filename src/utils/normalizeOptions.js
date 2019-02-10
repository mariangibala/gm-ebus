'use strict'

function normalizeOptions(options_) {
  let options

  if (typeof options_ === 'string') {
    options = { name: options_ }
  } else {
    // Make sure obj is unique in case user passes the same config to many constructors
    options = { ...options_ }
  }

  return options
}

export default normalizeOptions
