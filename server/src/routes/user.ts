import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../schemes/user'
import validateToken from '../middlewares/validateToken'

type DecodedToken = {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean,
  nbf: number,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  locale: string,
  iat: number,
  exp: number,
  jti: string
}

const user = express.Router()

const createToken = async (id: string) => {
  try {
    const secretKey = process.env.SECRET_KEY || 'Super secret key'

    const token = await jwt.sign({ id }, secretKey, { expiresIn: '7d' })
    return token
  } catch (error) {
    throw new Error('Failed to create token');
  }
}

user.post('/autoSignIn', validateToken, async (req, res) => {
  try {
    const userData = await User.findById(req.body.userId).exec()
    if (userData) {
      const token = await createToken(userData._id.toString())
      
      await res.json({ token, reputation: userData.reputation, name: userData.name })
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({message: error.message})
  }
})

user.post('/googleSignIn', async (req, res) => {
  try {
    const user = jwt.decode(req.body.credential) as DecodedToken

    if (user) {
      const existedUser = await User.findOne({ email: user.email }).exec()

      if (existedUser) {
        const token = await createToken(existedUser.id)
        await res.json({ token, reputation: existedUser.reputation, name: existedUser.name })
      } else {
        const newUser = new User({
          name: user.given_name,
          email: user.email,
        })

        const userData = await newUser.save()
        const id = await userData._id.toString()
        const token = await createToken(id)

        await res.json({ token, reputation: userData.reputation, name: userData.name })
      }
    }
  } catch (error: any) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
})

export default user




