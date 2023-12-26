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
  }
  // password: {
  //   required: true,
  //   type: String
  // },
  // words: [
  //   {  
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'UserWords'
  //   }
  // ]
})

const User = mongoose.model('User', userSchema)

export default User