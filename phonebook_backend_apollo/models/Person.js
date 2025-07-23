import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        unique: true,
        minlength: 4
    },
    phone: {
        type: String,
        minlength: 5
    },
    street: {
        type: String,
        require: true,
        minlength: 5
    },
    city: {
        type: String,
        require: true,
        minlength: 5
    },
    friendOf: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    } ]
})

const Person = mongoose.model('Person', personSchema)

export default Person