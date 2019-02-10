'use strict'

import ReactDOM from 'react-dom'
import EBus from './EBus'
import App from './App'

const renderApp = function(Component) {
  ReactDOM.render(<Component />, document.getElementById('app'))
}

if (module.hot) {
  module.hot.accept('./App', function() {
    const NextApp = require('./App').default
    renderApp(NextApp)
  })
}

renderApp(App)
