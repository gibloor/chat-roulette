import React from 'react'
import { Outlet } from 'react-router-dom'

import GoogleOAuth from './GoogleOAuth/GoogleOAuth'
import Footer from './Footer/Footer'
import Header from './Header/Header'

const Layouts = () => {
  return (
    <GoogleOAuth>
      <Header />
      <Outlet />
      <Footer />
    </GoogleOAuth>
  )
}

export default Layouts