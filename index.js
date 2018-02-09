const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('type', function (req) { return JSON.stringify(req.body)})

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
  },
  {
    name: 'Testi',
    number: '040-123456',
    id: 5
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      const date = new Date()
      res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
              <p> ${date}<p>`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  //  if (persons.find(person => person.name === body.name)) {
  //    return response.status(400).json({ error: 'name must be unique'})
  //  }

  const nameToBeAdded = body.name

  Person
    .find({ name: nameToBeAdded })
    .then(result => {
      if (result && result.length) {
        response.status(400).json({error: `${nameToBeAdded} is already included!`})
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person
          .save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id'})
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
