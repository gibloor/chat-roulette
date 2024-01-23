import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'

import { googleSignInAction } from 'redux/actions/userActions'
import { userSelector } from 'redux/selectors/userSelectors'
import Settings from './Settings/Settings'

import reputation from './reputation.png'
import activeUser from './activeUser.png'
import settings from './settings.svg'
import countries from './countries.svg'
import logo from 'assets/logo-2.png'

import './styles.scss'

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
                if (credentialResponse.credential) {
                  googleSignInAction(dispatch, { credential: credentialResponse.credential })
                }
              }}
              shape='circle'
              type='icon'
              onError={() => {
                console.error('Login Failed');
              }}
            />
          }
        </div>
      </div>

      {showSettings && <Settings close={() => setShowSettings(false)} />}
    </div>
  )
}

export default Header