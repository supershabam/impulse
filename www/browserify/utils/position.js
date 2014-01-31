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