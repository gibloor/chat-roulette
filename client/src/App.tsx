import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { autoSingInAction, changeDeviceAction } from 'redux/actions/userActions'

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layouts />}>
          <Route index element={<Main />} />
          {/* <Route path="own-words" element={<OwnWords />}>
            <Route index path=":packId?" element={<MainMenu />} />
            <Route path=":packId/:ExerciseType" element={<Exercise />} />
          </Route>
          <Route path="public-packs" element={<PublicPackages />} /> */}
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
