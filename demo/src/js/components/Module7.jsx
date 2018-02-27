'use strict'

import AppActions from '../actions/AppActions'

class Module7 extends React.Component {

  callApiA = () => {
    AppActions.getSomeData()
  }

  callApiB = () => {
    AppActions.getSomeOtherData()
  }

  render() {
    return (
      <div className="module">
        <h3>7</h3>
        <button onClick={this.callApiA}>Call API A action</button>
        <button onClick={this.callApiB}>Call API B action</button>
      </div>
    )
  }
}


module.exports = Module7

