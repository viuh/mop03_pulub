const express = require('express')
var morgan = require('morgan')


const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const cors = require('cors')
app.use(cors())


//app.use(morgan('tiny')) // 3.7
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

process.on('unhandledRejection', up => { throw up })

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
  console.log('fP2 for: ',person._id)
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


  app.post('/api/persons', (request, response) => {


    const body = request.body  

    //console.log('post',body, "vs ",request)
    console.log('DB add! for',body.name)
    if (body.name === undefined || body.name.length ===0 ) {   //3.6
      console.log('No name')
      return response.status(400).json({error: 'Name missing'})
    }
    if (body.number === undefined || body.number.length===0) {
      console.log('No number!')
      return response.status(400).json({error: 'Number missing'})
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: getRandomArbitrary(1,25000)
    })
  
    person
      .save()
      .then(formatPerson2)
      .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
      })
  
  })


app.post('/api/persons123', (request, response) => {  //3.5
    const body = request.body  

    //console.log('post',body, "vs ",request)
    console.log('DB add! for',body.name)
    if (body.name === undefined || body.name.length ===0 ) {   //3.6
      console.log('No name')
      return response.status(400).json({error: 'Name missing'})
    }
    if (body.number === undefined || body.number.length===0) {
      console.log('No number!')
      return response.status(400).json({error: 'Number missing'})
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: getRandomArbitrary(1,25000)
    })


    Person
      .find({name:body.name})
      .then(result=> {
        //response.status()
        /*if (result) {
        console.log('Diips', result.length, " - tai - ", body.name)

          return response.status(400).json({error: "Name exists already"})
          } 
          else {
        console.log('Sth else', result)*/
      if (result.length === 0) {
      person
      .save ()
      .then(addedPerson => {
        if (addedPerson) {
          console.log('test123')
          //response.json(addedPerson.formatPerson2)
          return response.json(formatPerson2(person))

        } else {
          console.log('test256')
          return response.status(404).end() //?
        }
      })
      .catch(error => {
        console.log(error)
        return response.status(404).end()
      })
      }

      })
      .catch(error => {
        console.log('Pluup123')
        console.log(error)
        response.status(404).end()
      })

    console.log('Jatkuupi taal')
    

/*    person
      .save ()
      .then(addedPerson => {
        if (addedPerson) {
          console.log('test123')
          //response.json(addedPerson.formatPerson2)
          return response.json(formatPerson2(person))

        } else {
          console.log('test256')
          return response.status(404).end() //?
        }
      })
      .catch(error => {
        console.log(error)
        return response.status(404).end()
      })*/

  })

  app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
  
    //console.log('DB Get!',id)
  

    Person
      .findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(formatPerson2(person)) }
        else {
          response.status(404).end()
        }
      })
      .catch( response.status(400).json({error: "Person not found."})
    )
  })
 
app.get('/api/personsxxx/:id', (request, response) => {
  const id = Number(request.params.id)
  
  console.log('DB Get!',id)

    if (Person.find({ id : id }).count()>0)
    {
      console.log('Found it: ',id)
      return response.json(formatPerson(person))
    } else {
      //console.log('Tai ei?',body.name)
      console.log('Person not found w id',id)
      return response.status(400).json({error: 'Person not found.'})
    }


/*    Person
      .findById(request.params.id)
      .then(person => {
        response.json(formatPerson(person))
      })*/
})



 app.delete('/api/persons/:id', (request, response) => {  //3.4
    const id = Number(request.params.id)
    //person = persons.filter(p => p.id !== id)
  
    if (id === undefined) {
      console.log('Deleted already:',id)
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
  });




    /*if (Person.find({"id" : id}).count()>0)
    {
      console.log('Deleting, stat:',person)
      response.status(204).end()
    
    }else {
      console.log('Tai ei?:',id)
    }*/


    
  })
  

  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const id = Number(request.params.id)
  
    const person = {
      number: body.number
    }
  
    Person
      .findByIdAndUpdate( id, person, { new: true } )
      .then(updatedPerson => {
        console.log('Putti? ', id)
        response.json(formatNote(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
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

