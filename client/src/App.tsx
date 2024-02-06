import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { autoSingInAction, changeDeviceAction, setCountryAction, setIntrelocutorCountriesAction } from 'redux/actions/userActions'

import Layouts from 'components/Layouts/Layouts'
import Main from 'components/pages/Main/Main'
import NoPage from 'components/pages/NoPage/NoPage'

import './App.scss'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) autoSingInAction(dispatch, { token })
  })

  useEffect(() => {
    changeDeviceAction(dispatch, { id: localStorage.getItem('videoInput') || '', name: 'videoInput' })
    changeDeviceAction(dispatch, { id: localStorage.getItem('audioInput') || '', name: 'audioInput' })
    changeDeviceAction(dispatch, { id: localStorage.getItem('audioOutput') || '', name: 'audioOutput' })
  }, [])

  useEffect(() => {
    axios.get('https://ipapi.co/json/').then((response) => {
      let data = response.data
      
      setCountryAction(dispatch, { country: data.country_name })
    }).catch((error) => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    // localStorage.removeItem('interlocutor_countries')

    const interlocutorCountries = localStorage.getItem('interlocutor_countries')
    if (interlocutorCountries) {
      setIntrelocutorCountriesAction(dispatch, { interlocutorCountries: JSON.parse(interlocutorCountries) })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layouts />}>
          <Route index element={<Main />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
