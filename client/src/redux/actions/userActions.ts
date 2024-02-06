import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"

import { authorization, changeDevice, Country, Device, IntrelocutorCountries, setCountry, setIntrelocturCountries, signOut } from "redux/reducers/userReducer"
import { DOMAIN } from "redux/reduxVariables"

type GoogleSignInProps = {
  credential: string
}

type Token = {
  token: string
}

type SignInProps = {
  id: string
  token: string
  name: string
  reputation: number
}

const signIn = async (dispatch: Dispatch, props: SignInProps) => {
  localStorage.setItem('token', props.token)

  await dispatch(authorization({ name: props.name, reputation: props.reputation, id: props.id }))
}

export const signOutAction = async (dispatch: Dispatch) => {
  await dispatch(signOut())
}

export const googleSignInAction = async (dispatch: Dispatch, props: GoogleSignInProps ) => {
  try {
    if (props.credential) {
      const authResult = await axios.post(`${DOMAIN}/user/googleSignIn`, props)
      await signIn(dispatch, authResult.data)
    } else {
      console.error('Credential missed')
    }

  } catch (err) {
    console.error(err)
  }
}

export const changeDeviceAction = async (dispatch: Dispatch, props: Device) => {
  await dispatch(changeDevice(props))
}

export const autoSingInAction = async (dispatch: Dispatch, props: Token) => {
  try {
    const headers = {authorization: `Bearer ${props.token}`} 
    const authResult = await axios.post(`${DOMAIN}/user/autoSignIn`, {}, { headers: headers })
    await signIn(dispatch, authResult.data)
  } catch (err) {
    console.error(err)
  }
}

export const setCountryAction = async (dispatch: Dispatch, props: Country) => {
  await dispatch(setCountry(props))
}

export const setIntrelocutorCountriesAction = async (dispatch: Dispatch, props: IntrelocutorCountries) => {
  await dispatch(setIntrelocturCountries(props))
}