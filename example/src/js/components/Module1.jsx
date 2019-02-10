'use strict'

import MainStore from '../stores/MainStore'

class Module1 extends React.Component {
  state = {
    value: null,
  }

  componentWillMount() {
    MainStore.listen(this.onChange)
  }

  componentWillUnmount() {
    MainStore.unlisten(this.onChange)
  }

  updateText = (e) => {
    MainStore.set('value', e.target.value)
  }

  onChange = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="module">
        <h3>1</h3>
        <textarea onChange={this.updateText} value={this.state.value} />
      </div>
    )
  }
}

module.exports = Module1
