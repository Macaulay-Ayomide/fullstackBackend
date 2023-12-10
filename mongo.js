const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
else if ((process.argv.length > 3) && (process.argv.length < 5)) {
    console.log('Do not forget to include name and number')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://izzimars:${password}@cluster0.daqtxva.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name) {
    const person = new Person({
        "name": name,
        "number": number,
    })
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}