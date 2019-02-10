'use strict'

import AppActions from '../actions/AppActions'

class Module8 extends React.Component {
  callErrorAPI = () => {
    AppActions.callErrorAPI()
  }

  render() {
    return (
      <div className="module">
        <h3>8</h3>
        <button onClick={this.callErrorAPI}>Simulate API error</button>
      </div>
    )
  }
}

module.exports = Module8
