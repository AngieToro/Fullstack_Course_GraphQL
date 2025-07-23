import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
    required: true
  },
  books: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
})

const Author = mongoose.model('Author', authorSchema)

export default Author 