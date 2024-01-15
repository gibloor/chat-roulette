import mongoose from 'mongoose'

const banRequestSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  requestDate: {
    required: true,
    type: Date,
  },
  rejected: {
    type: Boolean,
    default: false,
  }
})

const BanRequest = mongoose.model('BanRequest', banRequestSchema)

export default BanRequest