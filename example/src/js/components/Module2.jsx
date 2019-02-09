'use strict'

import MainStore from '../stores/MainStore'

class Module2 extends React.Component {

  componentWillMount() {
    MainStore.listen(this.onChange)
  }

  componentWillUnmount() {
    MainStore.unlisten(this.onChange)
  }

  onChange = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="module">
        <h3>2</h3>
        {this.state.value}
      </div>
    )
  }
}


module.exports = Module2

