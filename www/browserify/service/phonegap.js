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