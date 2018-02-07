const mongoose = require('mongoose')

const url = 'mongodb://psion:salainen@ds225308.mlab.com:25308/fullstackcourse-w3db'


mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

const Person = mongoose.model('Person', personSchema);
  

if (process.argv.length < 4) {
    Person
    .find({})
    .then(result => {
        console.log("puhelinluettelo:")
        result.forEach(person => {
            console.log(person.name, person.number)         
        })
        mongoose.connection.close()
    })
}

if (process.argv.length == 4) {
      const person = new Person({
          name: process.argv[2],
          number: process.argv[3]
      })
      
      person
        .save()
        .then(response => {
          console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
          mongoose.connection.close()
    })  
}

if (process.argv.length > 4) {
    console.log("Liikaa argumentteja") 
    mongoose.connection.close()
}
