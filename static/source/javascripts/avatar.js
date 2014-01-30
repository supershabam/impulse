/** @jsx React.DOM */

var Avatar = React.createClass({
  render: function() {
    return(
      <div>
        <ProfilePic username={this.props.username} />
      </div>
    )
  }
})

