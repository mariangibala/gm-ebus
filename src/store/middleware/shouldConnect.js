'use strict'

function shouldConnect(middlewareConfig, methodName, levelType) {

  const {
    isActive,
    only,
    exclude,
    onlyLevel,
    excludeLevel
  } = middlewareConfig
  
  const expectArrays = [
    only,
    exclude,
    onlyLevel,
    excludeLevel
  ]
  
  expectArrays.forEach(el =>{
    if (el && Array.isArray(el) === false){
      console.error('Middleware connection config incorrect. Expected Array but received:', el)
    }
  })

  if (isActive === false) return false

  let shouldConnectByMethodName 
  let shouldConnectByLevel 


  if (onlyLevel) {
    if (onlyLevel.includes(levelType)) shouldConnectByLevel = true
  } else if (excludeLevel) {
    if (!excludeLevel.includes(levelType)) shouldConnectByLevel = true
  } else {
    shouldConnectByLevel = true
  }

  if (only) {
    if (only.includes(methodName)) shouldConnectByMethodName = true
  } else if (exclude) {
    if (!exclude.includes(methodName)) shouldConnectByMethodName = true
  } else {
    shouldConnectByMethodName = true
  }


  return (shouldConnectByMethodName && shouldConnectByLevel) ? true : false
}

export default shouldConnect
