const express = require('express')
var morgan = require('morgan')


const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const cors = require('cors')
app.use(cors())


//app.use(morgan('tiny')) // 3.7
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

//process.on('unhandledRejection', up => { throw up })

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

/*let persons2 = [
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
]*/

const formatPerson2 = (person) => {
  console.log('fP2 for: ',person._id)
  return {
    name: person.name,
    number: person.number,
    _id: person._id,
    id: person.id
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}


app.post('/api/persons', (request, response) => {


  const body = request.body

  //console.log('post',body, "vs ",request)
  console.log('DB add! for',body.name)
  if (body.name === undefined || body.name.length ===0 ) {   //3.6
    console.log('No name')
    return response.status(400).json({ error: 'Name missing' })
  }
  if (body.number === undefined || body.number.length===0) {
    console.log('No number!')
    return response.status(400).json({ error: 'Number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: getRandomArbitrary(1,25000)
  })

  person
    .save()
    .then(formatPerson2)
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(
      error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted item: ' })
      }
    )

})




app.get('/api/persons/:id', (request, response) => {

  const id = request.params.id

  console.log('DB Get!', id)


  Person
  //.findById({"_id": id})
  //.findById(id)
    .find({ id:id })
    .then(person => {
      if (person) {
        console.log('Person: get for ',id, ' is ', person)
        //return response.formatPerson2(person)
        //return formatPersonX(person)
        //return Person.constructor.formatPersonX(person)
        return response.json(person[0])
      } else {
        //console.log('Virhe b?')
        return response.status(404).end()
      }
    })
    .catch(
      error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id: '+id })
      }
    )


})




app.delete('/api/persons/:id', (request, response) => {  //3.4
  const id = request.params.id

  console.log('Deleting for: ',id)
  if (id === undefined) {
    console.log('Malformatted id',id)
    return response.status(304)
  }


  Person.remove({ id: id }, function(err) {
    if (!err) {
      console.log('Deleting, stat:', id)
      return response.status(204).end()
    }
    else {
      //message.type = 'error';
      console.log('Item has already been deleted.')
      return response.status(304).end()
    }
  })
    .catch(
      error => {
        console.log(error)
        response.status(400).send({ error: 'Deleting failed for : '+id })
      }
    )

})


app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const id = request.params.id
  console.log('Update desired for: ', id , ' b:',body)

  const person = {
    number: body.number
  }

  Person
  //.findByIdAndUpdate( {id:id}, person, { new: true } )
    .findOneAndUpdate( { id:id }, person, { new:true })
  //.save ()
    .then(updatedPerson => {

      //console.log('Doing update... ', id, ' upd:', updatedPerson)
      response.json(formatPerson2(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted data/id '+id })
    })
})



app.get('/info', (req, res) => {  //3.2.

  var count = 0
  Person.find().exec(function (err, results) {
    count = results.length
    console.log('Info, countti:',count)

    let msg = 'puhelinluettelossa '+count+' henkilön tiedot'

    let date = new Date()
    res.send(msg + '<br><br>'+date)
  })
})



app.use(bodyParser.json())



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

