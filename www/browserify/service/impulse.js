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