import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  reputation: {
    required: true,
    type: Number,
    default: 50,
  },
  banned: {
    type: Boolean,
    default: false
  },
  banDuration: {
    type: Date,
  }
})

const User = mongoose.model('User', userSchema)

export default User