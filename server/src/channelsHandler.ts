import { Server } from 'socket.io'

import Interlocutor from './schemes/interlocutor'

type CountryFilter = {
  $in: string[]
}

type Restriction = {
  userId: {
    $ne: string
  }
  country?: CountryFilter
  reputation?: string
  interlocutorCountries?: CountryFilter
}

const channelsHandler = (io: Server) => {
  io.engine.on("connection_error", (err) => {
    console.error(err.message)
    console.error(err.context)
  });

  io.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  io.on('connection', (socket) => {
    socket.emit('getId', socket.id)

    socket.on("answerCall", ({ signal, socketId, userId }) => {
      io.to(socketId).emit("callAccepted", { signal, userId})
    })

    socket.on('startCommunication', async ({ signal, socketId, userId, country, interlocutorCountries, reputation, restrictionOn }) => {
      await Interlocutor.deleteMany({ userId: userId })

      const restriction: Restriction = {
        userId: { $ne: userId },
        interlocutorCountries: { $in: [country]}
      }

      if (interlocutorCountries) restriction.country = { $in: interlocutorCountries }
      // if (reputation) restriction.reputation = reputation

      const interlocutor = await Interlocutor.findOne(restrictionOn ? restriction : { userId: { $ne: userId }, $or: [{ interlocutorCountries: { $in: [country]}}, { restrictionOn: false }] }).exec()

      if (interlocutor) {
        await io.to(interlocutor.socketId).emit('connectInterlocutorToUser', { signal, socketId, userId })

        await Interlocutor.deleteOne(interlocutor._id)
      } else {
        console.log(userId, country)
        const newInterlocutor = new Interlocutor({
          socketId: socketId,
          userId: userId,
          country: country,
          reputation: reputation,
          restrictionOn: restrictionOn,
          interlocutorCountries: interlocutorCountries,
          searchStartTime: new Date(),
        })
        await newInterlocutor.save()
      }
    })
  })
}

export default channelsHandler
