const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("Connecting to: ", url)
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log("Error connecting to MongoDB: ", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "Name cannot be shorter than 3 characters"],
        required: [true, "Name field cannot be empty"]
    },
    number: {
        type: String,
        required: [true, "Number field cannot be empty"],
        validate: {
            validator: function(input){
                return /\d{2}-\d{5}\d+|\d{3}-\d{4}\d+/.test(input);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)