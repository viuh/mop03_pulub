const mongoose = require('mongoose')
var Schema = mongoose.Schema;

require('dotenv').config()

//console.log('db', process.env.DBUSER)

const dbname = process.env.MONGODB_NAME

console.log('Dbname:',dbname)
//orig '@ds217138.mlab.com:17138/pulub'

const url = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+dbname

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new Schema({
    name: String,
    number: String,
    id: String
})



/*personSchema.statics.getUsers = function() {
    return new Promise((resolve, reject) => {
      this.find((err, docs) => {
        if(err) {
          console.error(err)
          return reject(err)
        }
        console.log('Getti', docs.format)
        resolve(docs)
      })
    })
  }*/

personSchema.statics.formatPersonX = function(person) {
    console.log('formPer', person)
    return {
      name: person.name,
      number: person.number,
      id: person.id,
      _id: person._id
    }
}


const Person = mongoose.model('Person',personSchema)



/*const Person = mongoose.model('Person',
    {
        name: String,
        number: String,
    })*/

module.exports = Person





