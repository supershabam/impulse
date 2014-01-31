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