'use strict'

import AppActions from '../actions/AppActions'

class Module7 extends React.Component {

  callApiA = () => {
    AppActions.callFooAPI()
  }

  callApiB = () => {
    AppActions.callBarAPI()
  }

  render() {
    return (
      <div className="module">
        <h3>7</h3>
        <button onClick={this.callApiA}>Action call Foo API</button>
        <button onClick={this.callApiB}>Action call Bar API</button>
      </div>
    )
  }
}


module.exports = Module7

