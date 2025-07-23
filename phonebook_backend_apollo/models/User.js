import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        unique: true,
        minlength: 5
    },
    passwordHash: {
        type: String,
        require: true,
        minlength: 3
    },
    friends: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    } ]
})

const User = mongoose.model('User', userSchema)

export default User