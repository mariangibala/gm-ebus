'use strict'

const ownPropertyNames = Object.getOwnPropertyNames(function() {}.prototype)

function getOwnProps(el) {
  return Object.getOwnPropertyNames(el).filter((key) => {
    if (ownPropertyNames.includes(key)) return
    return key
  })
}

export default getOwnProps
