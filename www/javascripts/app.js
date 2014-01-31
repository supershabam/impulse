(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */var service  = require('./service')
  , Location = require('./views/location.jsx')

service.location().then(function(location) {
  React.renderComponent(
    Location( {latitude:location[0], longitude:location[1]} ),
    document.getElementById('app')
  )
}, function(err) {
})

},{"./service":2,"./views/location.jsx":6}],2:[function(require,module,exports){
module.exports = {
  location: require('./location')
}
},{"./location":3}],3:[function(require,module,exports){
module.exports = function() {
  return Promise.resolve([40.7608333, -111.8902778])
}
},{}],4:[function(require,module,exports){
module.exports = function() {
  if(typeof PhoneGap !== 'undefined') {
  } else {
    return Promise.resolve()
  }
}

var intervalID = window.setInterval(
      function() {
          if (PhoneGap.available) {
              window.clearInterval(intervalID);
              onDeviceReady();
          }
      },
      500
    )
},{}],5:[function(require,module,exports){
/** @jsx React.DOM */
},{}],6:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.p(null, "You are at ", this.props.latitude,", ", this.props.longitude)
    )
  }
})
},{}]},{},[1,2,3,4,5,6])