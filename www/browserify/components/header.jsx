var bus = require('../bus')

module.exports = React.createClass({
  makeClickHandler: function(view) {
    return function() {
      bus.emit('view', view, true)
    }
  },
  render: function() {
    return (
      <header>
        <button class="navigation" onClick={this.makeClickHandler('navigation')}>
          <i className="fa fa-bars"></i>
        </button>
        <h1>{this.props.title}</h1>
        <button class="bookmarks" onClick={this.makeClickHandler('bookmarks')}>
          <i className="fa fa-bookmark-o"></i>
        </button>
      </header>
    )
  }
})