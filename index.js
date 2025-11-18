const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', (request, response) => { return JSON.stringify(request.body) })

app.use(morgan(':method :url :status :response-time :data'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain'})
    let info = `Phonebook has information for ${persons.length} people \n`
    info = info.concat(new Date())
    response.end(info)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === request.params.id)

    if(person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(note => note.id !== request.params.id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body) return response.status(400).json({error: 'No content.'})
    if(!body.name) return response.status(400).json({error: 'Name not defined'})
    if(persons.find(person => person.name === body.name)) return response.status(400).json({error: 'Name must be unique'})
    if(!body.number) return response.status(400).json({error: 'Number not defined'})

    const person = {
        id: body.id,
        name: body.name,
        number: body.number,
    }
    
    persons = persons.concat(person)
    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => console.log("Server running on port 3001"))