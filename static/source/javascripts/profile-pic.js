/** @jsx React.DOM */

var ProfilePic = React.createClass({
  render: function() {
    return(
      <img src={'http://graph.facebook.com/' + this.props.username + '/picture'}>
    )
  }
})
