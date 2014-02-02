(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
/** @jsx React.DOM */var Header = require('./components/header.jsx')
var bus = new (require('events')).EventEmitter()

React.initializeTouchEvents(true)
var App = React.createClass({displayName: 'App',
  getInitialState: function() {
    return {
      view: ''
    }
  },
  componentDidMount: function() {
    this.onToggleNavigation = this.props.bus.on('toggleNavigation', function() {
      if (this.state.view == 'navigation') {
        this.setState({view: ''})
      } else {
        this.setState({view: 'navigation'})
      }
    }.bind(this))
    this.onToggleFavorites = this.props.bus.on('toggleFavorites', function() {
      if (this.state.view == 'favorites') {
        this.setState({view: ''})
      } else {
        this.setState({view: 'favorites'})
      }
    }.bind(this))
  },
  componentWillUnmount: function() {
    this.props.bus.removeListener('toggleFavorites', this.onToggleFavorites)
    this.props.bus.removeListener('toggleNavigation', this.onToggleNavigation)
  },
  handleMainClick: function(event) {
    if (this.state.view !== '') {
      this.setState({view: ''})
    }
  },
  render: function() {
    var classes = React.addons.classSet({
      'drawer': true,
      'drawer-left': this.state.view == 'favorites',
      'drawer-right': this.state.view == 'navigation'
    })
    return (
      React.DOM.div( {className:classes}, 
        React.DOM.section( {id:"main", className:"drawer-main-pane", onClick:this.handleMainClick}, 
          Header( {title:"Impulse", bus:this.props.bus} )
        ),
        React.DOM.aside( {id:"navigation", className:"drawer-left-pane"}, 
          React.DOM.h1(null, "left")
        ),
        React.DOM.aside( {id:"favorites", className:"drawer-right-pane"}, 
          React.DOM.h1(null, "right")
        )
      )
    )
  }
})
  
React.renderComponent(
  App( {bus:bus}),
  document.getElementById('app')
)

},{"./components/header.jsx":3,"events":1}],3:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  handlePressNavigation: function(event) {
    this.props.bus.emit('toggleNavigation')
  },
  handlePressFavorites: function(event) {
    this.props.bus.emit('toggleFavorites')
  },
  render: function() {
    return (
      React.DOM.header(null, 
        React.DOM.button( {class:"navigation", onClick:this.handlePressNavigation}, 
          React.DOM.i( {className:"fa fa-bars"})
        ),
        React.DOM.h1(null, this.props.title),
        React.DOM.button( {class:"favorites", onClick:this.handlePressFavorites}, 
          React.DOM.i( {className:"fa fa-bookmark-o"})
        )
      )
    )
  }
})
},{}],4:[function(require,module,exports){
/** @jsx React.DOM */
},{}],5:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.p(null, this.props.screenX,", ", this.props.screenY)
    )
  }
})
},{}],6:[function(require,module,exports){
/** @jsx React.DOM */module.exports = React.createClass({
  render: function() {
    return (
      React.DOM.section( {className:"settings"}, 
        React.DOM.li(null, "hi")
      )
    )
  }
})
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
function User() {
}
},{}],9:[function(require,module,exports){
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
},{"./ready":10}],10:[function(require,module,exports){
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
},{}]},{},[2,3,4,5,6,7,8,9,10])