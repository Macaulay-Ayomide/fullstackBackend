const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body'));


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    let id = request.params.id
    console.log(id)
    let person = persons.filter(i => {
        console.log(i, i.id, id)
        return (Number(i.id) === Number(id))
    })
    console.log(person)
    if (person.length > 0) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let tot = persons.length
    let tm = new Date()
    response.send(`<p>Phonebook has info for ${tot} people</p>${tm}`)
})

app.post('/api/persons', (request, response) => {
    let body = request.body
    if (!body.name || !body.number || persons.some(person => person.name === body.name)) {
        if (persons.some(person => person.name === body.name)) {
            return response.status(400).json({
                error: 'Name already  exist'
            })
        }
        else if (!body.number) {
            return response.status(400).json({
                error: 'number missing'
            })
        }
        return response.status(400).json({
            error: 'content missing'
        })
    }
    //let id = Math.max(...persons.map(person => person.id))
    let id = Math.floor(Math.random() * 500)
    let person = { ...body, "id": (id + 3) }
    persons.concat(person)
    response.json(person)
})
app.delete('/api/persons/:id', (request, response) => {
    let id = request.params.id
    persons = persons.filter(person => Number(person.id) !== Number(id))
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

console.log('Environment PORT:', process.env.PORT);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})