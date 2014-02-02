var Header = require('./header.jsx')

module.exports = React.createClass({
  render: function() {
    return (
      <section id="main" className="drawer-main-pane">
        <Header title="main" bus={this.props.bus} />
      </section>
    )
  }
})