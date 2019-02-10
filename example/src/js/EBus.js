import { EventsBus } from '../../../lib'

const EBus = new EventsBus({
  debug: {
    isActive: false,
  },
  actionsErrorHandler: function(err) {
    console.warn('Custom Error Catch')
    console.error(err)
  },
})

if (typeof window !== 'undefined' && !window.EBus) {
  window.EBus = EBus
}

export default EBus
