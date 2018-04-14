const express = require('express')
var morgan = require('morgan')


const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const cors = require('cors')
app.use(cors())


//app.use(morgan('tiny')) // 3.7
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

const Person = require('./models/person')


morgan.token('type', function (req, res) {   //3.8
  //console.log('dda',req.body)
  return JSON.stringify(req.body)

})

app.use(express.static('build'))



app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

let persons2 = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Martti Tienari",
    number: "040-123456"
  },
  {
    id: 3,
    name: "Arto Järvinen",
    number: "040-123456"
  }, {
    id: 4,
    name: "Lea Kutvonen",
    number: "040-123456"
  },
  {
    id: 12,
    name: "Jave Virtanen",
    number: "040-555555"
  }
]

const formatPerson2 = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

app.post('/api/persons', (request, response) => {  //3.5
    const body = request.body
    
    //console.log('post',body, "vs ",request)
    console.log('DB add! for',body.name)
    if (body.name === undefined) {   //3.6
      return response.status(400).json({error: 'Name missing'})
    }
    if (body.number === undefined) {
      return response.status(400).json({error: 'Number missing'})
    }
    
    if (persons.filter(p => p.name === body.name).length>0) {
      console.log('Löytyypi listasta jo', body.name)
      return response.status(400).json({error: 'Name exists already.'})
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
      id: getRandomArbitrary(1,25000)
    })
    //  console.log('Uusi',person)
  
    persons = persons.concat(person)
  
    //response.json(person)
    person
      .save ()
      .then(addedPerson => {
        response.json(formatPerson2(addedPerson))
      })

  })


 
app.get('/api/persons/:id', (request, response) => {
    console.log('DB Get!')
    Person
      .findById(request.params.id)
      .then(person => {
        response.json(formatPerson(person))
      })
})



 app.delete('/api/persons/:id', (request, response) => {  //3.4
    const id = Number(request.params.id)
    person = persons.filter(p => p.id !== id)
    console.log('Deleting, stat:',person)
    response.status(204).end()
  })
  



app.get('/info', (req, res) => {  //3.2.
    let qty = persons.length
    let msg = "puhelinluettelossa "+qty+" henkilön tiedot" 
    
    let date = new Date()
    res.send(msg + "<br><br>"+date)
  })
    


/*app.get('/api/persons', (req, res) => {
    res.json(persons)
  })*/
  
  app.use(bodyParser.json())
  


  const PORT = process.env.PORT || 3001
  
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

