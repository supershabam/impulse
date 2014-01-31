(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */var Loader = require('./components/loader.jsx')

React.initializeTouchEvents(true)
var App = React.createClass({displayName: 'App',
  getInitialState: function() {
    return {
      loaded: false
    }
  },
  render: function() {
    var main = null
    if(this.state.loaded) {
    } else {
      main = Loader(null )
    }
    return (
      React.DOM.div(null, 
        React.DOM.header(null, 
          React.DOM.h1(null, "impulse")
        ),
        main
      )
    )
  }
})
  
React.renderComponent(
  App(null ),
  document.getElementById('app')
)
},{"./components/loader.jsx":3}],2:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.img( {src:this.props.image} )
    )
  }
})
},{}],3:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.div( {className:"spinner"})
    )
  }
})
},{}],4:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.p(null, "You are at ", this.props.latitude,", ", this.props.longitude)
    )
  }
})
},{}],5:[function(require,module,exports){
function Impulse() {
  this.cache = {}
}

Impulse.prototype.get = function(id) {
  if(this.cache[id]) {
    return Promise.resolve(this.cache[id])
  } else {
    return this.fetch(id)
  }
}

Impulse.prototype.fetch = function(id) {
  // make ajax call
  return Promise.resolve({
    id: id,
    image: 'http://static.fjcdn.com/gifs/troll_7ee41e_2334249.gif'
  })
}

module.exports = Impulse
},{}],6:[function(require,module,exports){
function User() {
}
},{}],7:[function(require,module,exports){
var ready = require('./ready')

module.exports = function() {
  return ready.then(function() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(position) {
        resolve(position)
      }, function(err) {
        reject(err)
      })
    })
  })
}
},{"./ready":8}],8:[function(require,module,exports){
module.exports = (function() {
  if(typeof PhoneGap !== 'undefined') {
    return new Promise(function(resolve, reject) {
      var interval = function() {
        if (PhoneGap.available) {
          resolve(true)
        } else {
          setTimeout(interval, 100)
        }
      }
      interval()
    })
  } else {
    return Promise.resolve(true)
  }
})()
},{}]},{},[1,2,3,4,5,6,7,8])