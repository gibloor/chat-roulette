import { Server } from 'socket.io'

import Interlocutor from './schemes/interlocutor'

type Restriction = {
  userId: {
    $ne: string
  }
  country?: string
  reputation?: string
}

const channelsHandler = (io: Server) => {
  io.engine.on("connection_error", (err) => {
    console.log(err.message)
    console.log(err.context)
  });

  io.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  io.on('connection', (socket) => {
    socket.emit('getId', socket.id)

    socket.on("answerCall", ({ signal, socketId, userId }) => {
      io.to(socketId).emit("callAccepted", { signal, userId})
    })

    socket.on('startCommunication', async ({ signal, socketId, userId, country, reputation, restrictionOn }) => {
      console.log('pip pup')
      const restriction: Restriction = {
        userId: { $ne: userId }
      }

      if (country) restriction.country = country
      if (reputation) restriction.reputation = reputation

      const interlocutor = await Interlocutor.findOne(restrictionOn ? restriction : undefined).exec()

      if (interlocutor) {
        await io.to(interlocutor.socketId).emit('connectInterlocutorToUser', { signal, socketId, userId })

        await Interlocutor.deleteOne(interlocutor._id)
      } else {
        const newInterlocutor = new Interlocutor({
          socketId: socketId,
          userId: userId,
          country: country,
          reputation: reputation,
          restrictionOn: restrictionOn,
          searchStartTime: new Date(),
        })
        await newInterlocutor.save()
      }
    })
  })
}

export default channelsHandler
