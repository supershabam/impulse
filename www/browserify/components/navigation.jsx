var bus = require('../bus')

module.exports = React.createClass({
  makeClickHandler: function(view) {
    return function() {
      bus.emit('view', view)
    }
  },
  render: function() {
    return (
      <nav>
        <ul>
          <li className={this.props.view == 'home' ? 'active' : ''} onClick={this.makeClickHandler('home')}>Home</li>
          <li className={this.props.view == 'settings' ? 'active' : ''} onClick={this.makeClickHandler('settings')}>Settings</li>
          <li>Logout</li>
        </ul>
      </nav>
    )
  }
})