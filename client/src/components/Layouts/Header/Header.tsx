import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { userSelector } from 'redux/selectors/userSelectors'

import reputation from './reputation.png'
import settings from './settings.svg'
import countries from './countries.svg'
import logo from 'assets/logo.png'

import './styles.scss'
import Settings from './Settings/Settings'

const Header = () => {
  const user = useSelector(userSelector)

  const [showSettings, setShowSettings] = useState(false)

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
      </div>

      {showSettings && <Settings />}
    </div>
  )
}

export default Header