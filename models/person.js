const mongoose = require('mongoose')

const url = 'mongodb://psion:jee@ds225308.mlab.com:25308/fullstackcourse-w3db'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person