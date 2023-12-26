import express from 'express'

import Interlocutor from '../schemes/interlocutor'
import validateToken from '../middlewares/validateToken'

const interlocutor = express.Router()

type Restriction = {
  userId: {
    $ne: string
  }
  country?: string
  reputation?: string
}

interlocutor.post('/test/startCommunication/notInDB', async (req, res) => {
  try {
    const { from, country, reputation, restrictionOn } = req.body
    console.log('startCommunication notInDB', from, country, reputation, restrictionOn)

    // const newInterlocutor = new Interlocutor({
    //   userId: from,
    //   country: country,
    //   reputation: reputation,
    //   restrictionOn: restrictionOn,
    //   searchStartTime: new Date(),
    // })
    // await newInterlocutor.save()


    const restriction: Restriction = {
      userId: { $ne: from }
    }

    if (country) restriction.country = country
    if (reputation) restriction.reputation = reputation

    const search = await Interlocutor.findOne(restriction).exec()
    await console.log(search)
  } catch (error: any) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
})

export default interlocutor