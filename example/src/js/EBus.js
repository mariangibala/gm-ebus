
import {EventsBus}  from '../../../lib'

const EBus = new EventsBus({
  debug: {
    isActive: false
  },
})

if (typeof window !== 'undefined' && !window.EBus) {
  window.EBus = EBus
}

export default EBus
