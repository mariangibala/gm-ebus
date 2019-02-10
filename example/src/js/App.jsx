'use strict'

import Module1 from './components/Module1'
import Module2 from './components/Module2'
import Module3 from './components/Module3'
import Module4 from './components/Module4'
import Module5 from './components/Module5'
import Module6 from './components/Module6'
import Module7 from './components/Module7'
import Module8 from './components/Module8'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>gm-ebus example</h1>

        <div id="dashboard">
          <Module1 />
          <Module1 />
          <Module2 />
          <Module3 />
          <Module4 />
          <Module5 />
          <Module6 />
          <Module7 />
          <Module8 />
        </div>
      </div>
    )
  }
}

export default App
