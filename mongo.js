const mongoose = require('mongoose')

require('dotenv').config()

//console.log('db', process.env.DBUSER)

const url = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+'@ds217138.mlab.com:17138/pulub'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

console.log('args A', process.argv[2], "3", process.argv[3])
let NName = process.argv[2]
let NNumb = process.argv[3]

if (NName !== undefined && NNumb !== undefined ) {
let person = new Person({
  "name":  NName ,
  "number": NNumb 
})
//console.log('Person', NName , '+', NNumb)

person
  .save()
  .then(response => {
    console.log('Lisätään henkilö '+NName+' numero '+NNumb+' luetteloon')
    mongoose.connection.close()
  })

} else {
  //console.log('Trying to rpint all... ')

  Person
  .find({})
  .then(result => {
    console.log('Puhelinluettelo')
    result.forEach(person => {
      console.log(person.name + " "+ person.number)
    })
    mongoose.connection.close()

  })

} 