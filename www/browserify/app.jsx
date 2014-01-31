var Loader = require('./components/loader.jsx')

React.initializeTouchEvents(true)
var App = React.createClass({
  getInitialState: function() {
    return {
      loaded: false
    }
  },
  render: function() {
    var main = null
    if(this.state.loaded) {
    } else {
      main = <Loader />
    }
    return (
      <div>
        <header>
          <h1>impulse</h1>
        </header>
        {main}
      </div>
    )
  }
})
  
React.renderComponent(
  <App />,
  document.getElementById('app')
)