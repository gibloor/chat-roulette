import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'

export type SignIn = {
  id: string
  name: string
  reputation: number
}

export type Device = {
  name: string
  id: string
}

export type Country = {
  country: string
}

export type IntrelocutorCountries = {
  interlocutorCountries: string[]
}

type InitialState = SignIn & {
  [key: string]: string | number | string[]
  videoInput: string
  audioInput: string
  audioOutput: string
  country: string
  interlocutorCountries: string[]
}

const initialState: InitialState = {
  id: '',
  name: '',
  reputation: 0,
  videoInput: '',
  audioInput: '',
  audioOutput: '',
  country: '',
  interlocutorCountries: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authorization: (state, action: PayloadAction<SignIn>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    changeDevice: (state, action: PayloadAction<Device>) => {
      state[action.payload.name] = action.payload.id
    },
    setCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload.country
    },
    setIntrelocturCountries: (state, action: PayloadAction<IntrelocutorCountries>) => {
      state.interlocutorCountries = action.payload.interlocutorCountries
    },
    signOut: (state) => {
      localStorage.removeItem('token')

      return {
        ...state,
        ...initialState
      }
    }
  },
})

export const { authorization, changeDevice, setCountry, setIntrelocturCountries, signOut } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer