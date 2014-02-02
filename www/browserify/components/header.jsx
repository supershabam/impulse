module.exports = React.createClass({
  handlePressNavigation: function(event) {
    this.props.bus.emit('toggleNavigation')
  },
  handlePressFavorites: function(event) {
    this.props.bus.emit('toggleFavorites')
  },
  render: function() {
    return (
      <header>
        <button class="navigation" onClick={this.handlePressNavigation}>
          <i className="fa fa-bars"></i>
        </button>
        <h1>{this.props.title}</h1>
        <button class="favorites" onClick={this.handlePressFavorites}>
          <i className="fa fa-bookmark-o"></i>
        </button>
      </header>
    )
  }
})