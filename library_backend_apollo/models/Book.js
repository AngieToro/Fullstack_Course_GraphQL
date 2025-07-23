import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: Number,
    required: true,
    minlength: 4
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    require: true
  },
  genres: [
    { type: String }
  ]
})

const Book = mongoose.model('Book', bookSchema)

export default Book