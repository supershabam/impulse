var Header = require('./components/header.jsx')
var bus = new (require('events')).EventEmitter()

React.initializeTouchEvents(true)
var App = React.createClass({
  getInitialState: function() {
    return {
      view: ''
    }
  },
  componentDidMount: function() {
    this.onToggleNavigation = this.props.bus.on('toggleNavigation', function() {
      if (this.state.view == 'navigation') {
        this.setState({view: ''})
      } else {
        this.setState({view: 'navigation'})
      }
    }.bind(this))
    this.onToggleFavorites = this.props.bus.on('toggleFavorites', function() {
      if (this.state.view == 'favorites') {
        this.setState({view: ''})
      } else {
        this.setState({view: 'favorites'})
      }
    }.bind(this))
  },
  componentWillUnmount: function() {
    this.props.bus.removeListener('toggleFavorites', this.onToggleFavorites)
    this.props.bus.removeListener('toggleNavigation', this.onToggleNavigation)
  },
  handleMainClick: function(event) {
    if (this.state.view !== '') {
      this.setState({view: ''})
    }
  },
  render: function() {
    var classes = React.addons.classSet({
      'drawer': true,
      'drawer-left': this.state.view == 'favorites',
      'drawer-right': this.state.view == 'navigation'
    })
    return (
      <div className={classes}>
        <section id="main" className="drawer-main-pane" onClick={this.handleMainClick}>
          <Header title="Impulse" bus={this.props.bus} />
        </section>
        <aside id="navigation" className="drawer-left-pane">
          <h1>left</h1>
        </aside>
        <aside id="favorites" className="drawer-right-pane">
          <h1>right</h1>
        </aside>
      </div>
    )
  }
})
  
React.renderComponent(
  <App bus={bus}/>,
  document.getElementById('app')
)
