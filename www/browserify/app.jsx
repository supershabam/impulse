var bus = require('./bus')
var Header = require('./components/header.jsx')
var Navigation = require('./components/navigation.jsx')

React.initializeTouchEvents(true)
var App = React.createClass({
  componentDidMount: function() {
    this.onView = bus.on('view', function(view, toggle) {
      if(typeof toggle == 'undefined') {
        toggle = false
      }
      if (this.state.view == view && toggle) {
        view = 'home'
      }
      if (view == 'navigation') {
        this.setState({pane: 'left'})
      } else if (view == 'bookmarks') {
        this.setState({pane: 'right'})
      } else {
        this.setState({view: view, pane: 'main'})
      }
    }.bind(this))
  },
  componentWillUnmount: function() {
    bus.removeListener('view', this.onView)
  },
  getInitialState: function() {
    return {
      view: 'home',
      pane: 'main'
    }
  },
  render: function() {
    var classes = React.addons.classSet({
      'drawer': true,
      'drawer-left': this.state.pane == 'right',
      'drawer-right': this.state.pane == 'left'
    })
    var main = null
    switch(this.state.view) {
    case 'settings':
      main = <Header title="settings" />
      break
    default:
      main = <Header title="home" />
    }
    return (
      <div className={classes}>
        <div id="main" className="drawer-main-pane">
          {main}
        </div>
        <div className="drawer-left-pane">
          <Navigation view={this.state.view} />
        </div>
        <div className="drawer-right-pane">
          <h1>right</h1>
        </div>
      </div>
    )
  }
})
  
React.renderComponent(
  <App />,
  document.getElementById('app')
)
