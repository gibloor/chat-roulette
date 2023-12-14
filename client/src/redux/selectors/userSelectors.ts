import { createSelector } from 'reselect'
import { RootState } from '../store'

const getUser = (state: RootState) => state.user
const getDevices = (state: RootState) => ({
  videoInput: state.user.videoInput,
  audioOutput: state.user.audioOutput,
  audioInput: state.user.audioInput
})

export const userSelector = createSelector(getUser, (info) => info)
export const userDevicesSelector = createSelector(getDevices, (info) => info)