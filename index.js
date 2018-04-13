const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


let persons = [
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
  }
]

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

app.post('/api/persons', (request, response) => {  //3.5
    const body = request.body
    
    //console.log('post',body, "vs ",request)

    if (body.name === undefined) {   //3.6
      return response.status(400).json({error: 'Name missing'})
    }
    if (body.number === undefined) {
      return response.status(400).json({error: 'Number missing'})
    }
    
    if (persons.filter(p => p.name === body.name).length>0) {
      //console.log('Löytyypi listasta', body.name)
      return response.status(400).json({error: 'Name exists already.'})
    }
  
    
    const person = {
      name: body.name,
      number: body.number,
      id: getRandomArbitrary(1,25000)
    }
    console.log('Uusi',person)
  
    persons = persons.concat(person)
  
    response.json(person)
  })



app.get('/api/persons/:id', (request, response) => {  //3.3
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
  
    if ( person ) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  
  app.delete('/api/persons/:id', (request, response) => {  //3.4
    const id = Number(request.params.id)
    person = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })
  



app.get('/info', (req, res) => {  //3.2.
    let qty = persons.length
    let msg = "puhelinluettelossa "+qty+" henkilön tiedot" 
    
    let date = new Date()
    res.send(msg + "<br><br>"+date)
  })
    


app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  
  app.use(bodyParser.json())
  


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

