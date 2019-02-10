'use strict'

import SecondaryStore from '../stores/SecondaryStore'
import MainStore from '../stores/MainStore'

class Module5 extends React.Component {
  state = {
    mainStore: {},
    secondaryStore: {},
  }

  componentWillMount() {
    MainStore.listen(this.onChangeMainStore)
    SecondaryStore.listen(this.onChangeSecondaryStore)
  }

  componentWillUnmount() {
    MainStore.unlisten(this.onChangeMainStore)
    SecondaryStore.unlisten(this.onChangeSecondaryStore)
  }

  onChangeSecondaryStore = (state) => {
    this.setState({ secondaryStore: state })
  }

  onChangeMainStore = (state) => {
    this.setState({ mainStore: state })
  }

  render() {
    return (
      <div className="module">
        <h3>5</h3>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
}

module.exports = Module5
