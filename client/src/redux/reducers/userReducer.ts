import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'

type SignIn = {
  login: string
  password: string
}

export type Device = {
  name: string
  id: string
}

type InitialState = {
  [key: string]: string,
  id: string,
  videoInput: string,
  audioInput: string,
  audioOutput: string,
}

const initialState: InitialState = {
  id: '',
  videoInput: '',
  audioInput: '',
  audioOutput: '',
}

const login = async () => {
  console.log('ky')
  return 4
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authorization: (state, action: PayloadAction<SignIn>) => {
      const x = login()
      console.log(x)
      state.id = '25'
    },
    deauthorization: () => {

    },
    changeDevice: (state, action: PayloadAction<Device>) => {
      state[action.payload.name] = action.payload.id
    }
  },
})

export const { authorization, deauthorization, changeDevice } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer