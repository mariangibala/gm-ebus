'use strict'

import SecondaryStore from '../stores/SecondaryStore'

class Module4 extends React.Component {

  state = {
    value: null
  }

  componentWillMount() {
    SecondaryStore.listen(this.onChange)
  }

  componentWillUnmount() {
    SecondaryStore.unlisten(this.onChange)
  }

  updateText = (e) => {
    SecondaryStore.setCustomFunc('value', e.target.value)
  }

  onChange = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="module">
        <h3>4</h3>
        <textarea onChange={this.updateText} value={this.state.value}/>
      </div>
    )
  }
}


module.exports = Module4

