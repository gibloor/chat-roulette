import mongoose from 'mongoose'

const interlocutorSchema = new mongoose.Schema({
  socketId: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  reputation: {
    type: Number,
  },
  searchStartTime: {
    required: true,
    type: Date,
  },
  restrictionOn: {
    type: Boolean,
  }
})

const Interlocutor = mongoose.model('Interlocutor', interlocutorSchema)

export default Interlocutor