require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

const PORT = process.env.PORT

morgan.token('data', (request, response) => { return JSON.stringify(request.body) })

const errorHandler = (error, request, response, next) => {
    console.log(error)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'Malformed ID'})
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(morgan(':method :url :status :response-time :data'))
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    Person.countDocuments()
        .then(count => {
            response.writeHead(200, { 'Content-Type': 'text/plain'})
            let info = `Phonebook has information for ${count} people \n`
            info = info.concat(new Date())
            response.end(info)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if(result) response.json(result)
            else response.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person ({
      name: body.name,
      number: body.number,
    })
    
    person.save().then(newContact => {
      response.json(newContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    newNumber = request.body.number
    Person.findById(request.params.id)
    .then(person => {
        if(!person) return response.status(404).end()
        person.number = newNumber
        return person.save().then(updatedPerson => {
            response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

app.use(errorHandler)

app.listen(PORT, () => console.log("Server running on port 3001"))