import express from 'express'
import { createServer } from 'https'
import { Server } from 'socket.io'
import { readFileSync } from 'fs'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

import user from './routes/user'
import interlocutor from './routes/interlocutor'
import channelsHandler from './channelsHandler'

dotenv.config()

const PORT = process.env.PORT || 8080
const app = express()

const server = createServer({
  key: readFileSync('./https_staff/server.key'),
  cert: readFileSync('./https_staff/server.cert'),
}, app)

const io = new Server(server, {
  cors: {
    origin: '*', // process.env.REACT_APP_DOMAIN || 'https://www.humanroulette.net', // 
    methods: ['GET', 'POST'],
    // credentials: true
  }
})

const mongoString = process.env.DATABASE_URL

if (mongoString) {
  mongoose.connect(mongoString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  const database = mongoose.connection
  database.on('error', (error) => {
    console.log(error)
  })

  database.once('connected', () => {
    console.log('Database Connected')
  })
} else {
  console.log('DATABASE_URL - undefined')
}

app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors())
app.use(express.json())

app.use('/api/user', user)
app.use('/api/interlocutor', interlocutor)

channelsHandler(io)

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))