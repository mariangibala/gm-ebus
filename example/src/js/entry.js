'use strict'

import ReactDOM from 'react-dom'
import EBus from './EBus'
import App from './App'

const renderApp = function(Component){
  ReactDOM.render(<Component/>, document.getElementById('app'))
}

renderApp(App)
