import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'

import { userSelector } from 'redux/selectors/userSelectors'
import Settings from './Settings/Settings'

import reputation from './reputation.png'
import activeUser from './activeUser.png'
import settings from './settings.svg'
import countries from './countries.svg'
import logo from 'assets/logo.png'

import './styles.scss'
import { googleSignInAction } from 'redux/actions/userActions'

const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)

  const [showSettings, setShowSettings] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <div className='header'>
      <div className='header__info'>
        <img
          className='header__logo'
          src={logo}
          alt='Logo'
        />

        {/* <div>
          Reputation (Toxic / Ok / Nice)

          (!) - explanation
        </div> */}
      </div>
      
      <div className='header__functionality'>
        <div className='header__functionality_block'>
          <img
            className='header__reputation'
            onClick={() => {}}
            src={reputation}
            alt='Reputation mod'
          />
        </div>

        <div className='header__functionality_block'>
          <img
            className='header__countries'
            onClick={() => {}}
            src={countries}
            alt='Countries'
          />
        </div>

        <div className='header__functionality_block'>
          <img
            className='header__settings'
            onClick={() => setShowSettings(!showSettings)}
            src={settings}
            alt='Settings'
          />
        </div>

        <div className='header__functionality_block'>
          {user.name
          ? <img src={activeUser} />
          : <GoogleLogin
              onSuccess={credentialResponse => {
                // console.log(credentialResponse);
                if (credentialResponse.credential) {
                  googleSignInAction(dispatch, { credential: credentialResponse.credential })
                }
              }}
              shape='circle'
              type='icon'

              // type	standard | icon
              // theme	outline | filled_blue | filled_black
              // size	large | medium | small
              // text	signin_with | signup_with | continue_with | signin
              // shape	rectangular | pill | circle | square
              // logo_alignment	left | center
              // width	string
              // locale	string - https://developers.google.com/identity/gsi/web/reference/js-reference#locale

              onError={() => {
                console.error('Login Failed');
              }}
            />
          }
        </div>
      </div>

      {showSettings && <Settings />}
    </div>
  )
}

export default Header