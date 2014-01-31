module.exports = React.createClass({
  render: function() {
    return (
      <p>You are at {this.props.latitude}, {this.props.longitude}</p>
    )
  }
})