'use strict'

import MainStore from '../stores/MainStore'

class Module6 extends React.Component {

  state = {}

  componentWillMount() {
    MainStore.listen(this.onChange)
  }

  componentWillUnmount() {
    MainStore.unlisten(this.onChange)
  }

  update = (e) => {
    MainStore.set('sliderValue', e.target.value)
  }

  onChange = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="module">
        <h3>6</h3>
        <input
          onChange={this.update}
          value={this.state.sliderValue}
          type="range"
          min="0"
          max="500"
          step="1"/>
      </div>
    )
  }
}


module.exports = Module6

