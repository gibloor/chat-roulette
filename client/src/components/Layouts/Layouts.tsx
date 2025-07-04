import React from 'react'
import { Outlet } from 'react-router-dom'

import GoogleOAuth from './GoogleOAuth/GoogleOAuth'
import Header from './Header/Header'

const Layouts = () => {
  return (
    <GoogleOAuth>
      <Header />
      <Outlet />
    </GoogleOAuth>
  )
}

export default Layouts