'use strict'

import SecondaryStore from '../stores/SecondaryStore'

class Module3 extends React.Component {
  state = {
    value: null,
  }

  componentWillMount() {
    SecondaryStore.listen(this.onChange)
  }

  componentWillUnmount() {
    SecondaryStore.unlisten(this.onChange)
  }

  onChange = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="module">
        <h3>3</h3>
        {this.state.value}
      </div>
    )
  }
}

module.exports = Module3
