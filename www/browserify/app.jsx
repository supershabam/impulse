var service  = require('./service')
  , Location = require('./views/location.jsx')

service.location().then(function(location) {
  React.renderComponent(
    <Location latitude={location[0]} longitude={location[1]} />,
    document.getElementById('app')
  )
}, function(err) {
})
