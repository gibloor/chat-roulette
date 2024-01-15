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

type InitialState = SignIn & {
  [key: string]: string | number
  videoInput: string
  audioInput: string
  audioOutput: string
}

const initialState: InitialState = {
  id: '',
  name: '',
  reputation: 0,
  videoInput: '',
  audioInput: '',
  audioOutput: '',
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