import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'

import { googleSignInAction, signOutAction } from 'redux/actions/userActions'
import { userSelector } from 'redux/selectors/userSelectors'

import Settings from './Settings/Settings'
import CountriesSelector from './CountriesSelector/CountriesSelector'

// import reputation from './reputation.png'
import activeUser from './activeUser.png'
import settings from './settings.svg'
import countries from './countries.svg'
import logo from 'assets/logo.png'

import './styles.scss'

const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)

  const [showSettings, setShowSettings] = useState(false)
  // const [showSignIn, setShowSignIn] = useState(false)
  const [showCountriesSelector, setShowCountriesSelector] = useState(false)

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
        {/* <div className='header__functionality_block'>
          <img
            className='header__reputation'
            onClick={() => {}}
            src={reputation}
            alt='Reputation mod'
          />
        </div> */}

        <div className='header__functionality_block' onClick={() => setShowCountriesSelector(!showCountriesSelector)}>
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

        {user.name ?
          <>
            <div className='header__functionality_block'>
              <img className='header__active-user' alt='active-user' src={activeUser} />
            </div>
            <div className='header__functionality_block' onClick={() => signOutAction(dispatch)}>
              <span className='header__sign-out'>
                Sign out 
              </span>
            </div>
          </> :
          <div className='header__functionality_block'>
          <GoogleLogin
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
          </div>
        }
      </div>

      {showSettings && <Settings close={() => setShowSettings(false)} />}

      {showCountriesSelector && <CountriesSelector close={() => setShowCountriesSelector(false)} />}
    </div>
  )
}

export default Header