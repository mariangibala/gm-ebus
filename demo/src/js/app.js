'use strict'

import ReactDOM from 'react-dom'

import Module1 from './components/module1'
import Module2 from './components/module2'
import Module3 from './components/module3'
import Module4 from './components/module4'
import Module5 from './components/module5'
import Module6 from './components/module6'
import Module7 from './components/module7'

class Home extends React.Component {

  render() {
    return (
      <div>
        <h1>gm-ebus demo</h1>

        <div id="dashboard">
          <Module1/>
          <Module1/>
          <Module2/>
          <Module3/>
          <Module4/>
          <Module5/>
          <Module6/>
          <Module7/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<Home/>, document.getElementById('app'))

