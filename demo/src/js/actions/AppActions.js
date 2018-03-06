'use strict'

import AppActionsModel from './AppActionsModel'
import EBus from '../EBus'

const AppActions = new AppActionsModel(EBus)

export default AppActions