import { Dispatch } from "@reduxjs/toolkit"
import { authorization, changeDevice, Device } from "redux/reducers/userReducer"

type SignInProps = {
  login: string,
  password: string,
}

export const signIn = async (dispatch: Dispatch, props: SignInProps) => {
  const x = await console.log('call to db')
  await dispatch(authorization({login: '', password: ''}))
}

export const signUp = async () => {

}

export const signOut = async () => {

}

export const changeDeviceAction = async (dispatch: Dispatch, props: Device) => {
  await dispatch(changeDevice(props))
}