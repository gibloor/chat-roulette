import { Server } from 'socket.io'
import { Types } from 'mongoose'

import Interlocutor from './schemes/interlocutor'

type Restriction = {
  userId: {
    $ne: string
  }
  country?: string
  reputation?: string
}

const channelsHandler = (io: Server) => {
  io.on('connection', (socket) => {
    // user gets his id
    socket.emit('getId', socket.id)

    //
    socket.on('disconnect', () => {
      // socket.broadcast.emit('callEnded')
    })

    socket.on('changeInterlocutor', () => {
      // socket.broadcast.emit('callEnded')
    })

    socket.on("answerCall", ({ signal, userId }) => {
      io.to(userId).emit("callAccepted", signal)
      console.log('second user:', signal)
    })

    socket.on('startCommunication', async ({ signal, from, country, reputation, restrictionOn }) => {
      console.log('first user:', signal)
      const restriction: Restriction = {
        userId: { $ne: from }
      }

      if (country) restriction.country = country
      if (reputation) restriction.reputation = reputation

      const interlocutor = await Interlocutor.findOne(
        // restriction
      ).exec()
      
      if (interlocutor) {
        // await console.log('called and deleted')
        await io.to(interlocutor.userId).emit('connectInterlocutorToUser', { signal, from })

        await Interlocutor.deleteOne(interlocutor._id)
      } else {
        // await console.log('added to db')
        const newInterlocutor = new Interlocutor({
          userId: from,
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
